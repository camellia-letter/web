'use client';

import { useEffect, useState } from "react";
import { Button, Stack } from "@mantine/core";
import { IconCopy, IconMessageCircle } from "@tabler/icons-react";
import { trackShare } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface ShareButtonsProps {
  invitationId: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  venueAddress: string;
  invitationUrl: string;
  mainImageUrl?: string;
}

export const ShareButtons = ({
  invitationId,
  groomName,
  brideName,
  weddingDate,
  venue,
  venueAddress: _venueAddress,
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

    // 날짜 형식 포맷팅
    const date = new Date(weddingDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];
    const hour = date.getHours();

    const formattedDateTime = `${year}년 ${month}월 ${day}일 ${weekday} ${hour}시`;

    // 카카오톡 공유 컨텐츠 구성
    const content = {
      title: `${groomName} ❤ ${brideName} 결혼합니다`,
      description: `${formattedDateTime} | ${venue}`,
      link: {
        mobileWebUrl: invitationUrl,
        webUrl: invitationUrl,
      },
      ...(mainImageUrl && { imageUrl: mainImageUrl }),
    };

    // sendDefault 방식 사용 - 버튼 텍스트 커스터마이징
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content,
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
