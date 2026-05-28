'use client';

import { useEffect, useState } from 'react';
import { Button, Stack } from '@mantine/core';
import { IconCopy, IconMessageCircle } from '@tabler/icons-react';
import { trackShare } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

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
    try {
      if (!window.Kakao || !window.Kakao.isInitialized() || !window.Kakao.Share) {
        addToast('error', '카카오 SDK를 사용할 수 없습니다.');
        return;
      }

      const templateId = process.env.NEXT_PUBLIC_KAKAO_TEMPLATE_ID;

      // 템플릿 ID가 없으면 sendDefault 방식 사용
      if (!templateId) {
        const date = new Date(weddingDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];
        const hour = date.getHours();
        const formattedDateTime = `${year}년 ${month}월 ${day}일 ${weekday} ${hour}시`;

        // 이미지 URL 절대 경로 변환
        let absoluteImageUrl = '';
        if (mainImageUrl) {
          if (mainImageUrl.startsWith('http')) {
            absoluteImageUrl = mainImageUrl;
          } else {
            const baseUrl = invitationUrl.match(/^https?:\/\/[^/]+/)?.[0] || '';
            absoluteImageUrl = `${baseUrl}${mainImageUrl}`;
          }
        }

        const content: {
          title: string;
          description: string;
          imageUrl?: string;
          link: { mobileWebUrl: string; webUrl: string };
        } = {
          title: `${groomName} ❤ ${brideName} 결혼합니다`,
          description: `${formattedDateTime} | ${venue}`,
          link: {
            mobileWebUrl: invitationUrl,
            webUrl: invitationUrl,
          },
        };

        if (absoluteImageUrl) {
          content.imageUrl = absoluteImageUrl;
        }

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
        return;
      }

      // sendCustom 방식 사용 - 카카오 개발자 콘솔에서 만든 템플릿 사용
      const date = new Date(weddingDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const weekday = weekdays[date.getDay()];
      const hour = date.getHours();
      const formattedDateTime = `${year}년 ${month}월 ${day}일 ${weekday} ${hour}시`;

      // URL에서 path 추출 (도메인 제거)
      const invitationPath = invitationUrl.replace(/^https?:\/\/[^/]+/, '');

      // 이미지 URL을 절대 경로로 변환 (모바일 카카오톡은 절대 경로만 허용)
      let absoluteImageUrl = '';
      if (mainImageUrl) {
        if (mainImageUrl.startsWith('http')) {
          absoluteImageUrl = mainImageUrl;
        } else {
          const baseUrl = invitationUrl.match(/^https?:\/\/[^/]+/)?.[0] || '';
          absoluteImageUrl = `${baseUrl}${mainImageUrl}`;
        }
      }

      const templateArgs: Record<string, string> = {
        GROOM_NAME: groomName,
        BRIDE_NAME: brideName,
        WEDDING_DATE: formattedDateTime,
        VENUE: venue,
        INVITATION_PATH: invitationPath,
      };

      // 이미지가 있을 때만 추가 (절대 경로로 변환된 URL 사용)
      if (absoluteImageUrl) {
        templateArgs.THUMB = absoluteImageUrl;
      }

      window.Kakao.Share.sendCustom({
        templateId: parseInt(templateId, 10),
        templateArgs: templateArgs,
      });

      trackShare(invitationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      addToast('error', `카카오톡 공유 실패: ${errorMessage}`);
    }
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
