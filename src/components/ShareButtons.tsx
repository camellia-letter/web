'use client';

import { useEffect, useState } from 'react';
import { Button, Stack } from '@mantine/core';
import { IconCopy, IconMessageCircle } from '@tabler/icons-react';
import { trackShare } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { formatDateKR } from '@/lib/dateUtils';

interface ShareButtonsProps {
  invitationId: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  invitationUrl: string;
  mainImageUrl?: string;
}

export const ShareButtons = ({
  invitationId,
  groomName,
  brideName,
  weddingDate,
  venue,
  invitationUrl,
  mainImageUrl,
}: ShareButtonsProps) => {
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    const checkKakao = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        setIsKakaoReady(true);
      } else {
        timerId = setTimeout(checkKakao, 100);
      }
    };
    checkKakao();
    return () => clearTimeout(timerId);
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized() || !window.Kakao.Share) {
      addToast('error', '카카오 SDK가 로드되지 않았습니다.');
      return;
    }

    const formattedDate = formatDateKR(weddingDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (mainImageUrl) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${groomName} ♥ ${brideName} 결혼합니다`,
          description: `${formattedDate}\n${venue}`,
          imageUrl: mainImageUrl,
          link: {
            mobileWebUrl: invitationUrl,
            webUrl: invitationUrl,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: invitationUrl,
              webUrl: invitationUrl,
            },
          },
        ],
      });
    } else {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: `${groomName} ♥ ${brideName} 결혼합니다\n\n${formattedDate}\n${venue}`,
        link: {
          mobileWebUrl: invitationUrl,
          webUrl: invitationUrl,
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: invitationUrl,
              webUrl: invitationUrl,
            },
          },
        ],
      });
    }

    trackShare(invitationId);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      addToast('success', '링크가 복사되었습니다.');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = invitationUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addToast('success', '링크가 복사되었습니다.');
    }

    trackShare(invitationId);
  };

  return (
    <Stack gap="sm">
      <Button
        onClick={handleKakaoShare}
        disabled={!isKakaoReady}
        radius="xl"
        size="md"
        fullWidth
        leftSection={<IconMessageCircle size={20} stroke={1.8} />}
        styles={{
          root: {
            backgroundColor: '#FEE500',
            color: '#3C1E1E',
          },
        }}
      >
        카카오톡으로 공유하기
      </Button>

      <Button
        onClick={handleCopyLink}
        variant="default"
        radius="xl"
        size="md"
        fullWidth
        leftSection={<IconCopy size={20} stroke={1.8} />}
      >
        링크 복사하기
      </Button>
    </Stack>
  );
};
