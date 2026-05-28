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
    // 사용자 제스처를 유지하기 위해 SDK 호출을 최대한 빨리 실행
    if (!window.Kakao?.isInitialized() || !window.Kakao.Share) return;

    const templateId = process.env.NEXT_PUBLIC_KAKAO_TEMPLATE_ID;

    // 날짜 형식 포맷팅 (미리 계산)
    const date = new Date(weddingDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];
    const hour = date.getHours();
    const formattedDateTime = `${year}년 ${month}월 ${day}일 ${weekday} ${hour}시`;

    // 이미지 URL을 절대 경로로 변환
    let absoluteImageUrl = '';
    if (mainImageUrl) {
      absoluteImageUrl = mainImageUrl.startsWith('http')
        ? mainImageUrl
        : `${invitationUrl.match(/^https?:\/\/[^/]+/)?.[0] || ''}${mainImageUrl}`;
    }

    try {
      if (!templateId) {
        // 템플릿 ID가 없으면 sendDefault 방식 사용
        const content: {
          title: string;
          description: string;
          imageUrl?: string;
          link: { mobileWebUrl: string; webUrl: string };
        } = {
          title: `${groomName} ❤ ${brideName} 결혼합니다`,
          description: `${formattedDateTime} | ${venue}`,
          link: { mobileWebUrl: invitationUrl, webUrl: invitationUrl },
        };

        if (absoluteImageUrl) content.imageUrl = absoluteImageUrl;

        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content,
          buttons: [
            {
              title: '청첩장 보기',
              link: { mobileWebUrl: invitationUrl, webUrl: invitationUrl },
            },
          ],
        });
      } else {
        // sendCustom 방식 사용
        const invitationPath = invitationUrl.replace(/^https?:\/\/[^/]+/, '');
        const templateArgs: Record<string, string> = {
          GROOM_NAME: groomName,
          BRIDE_NAME: brideName,
          WEDDING_DATE: formattedDateTime,
          VENUE: venue,
          INVITATION_PATH: invitationPath,
        };

        // 임시: 이미지 제외하고 테스트 (4002 에러 디버깅용)
        // if (absoluteImageUrl) templateArgs.THUMB = absoluteImageUrl;

        window.Kakao.Share.sendCustom({
          templateId: parseInt(templateId, 10),
          templateArgs,
        });
      }

      // 트래킹은 SDK 호출 후 비동기로 처리
      setTimeout(() => trackShare(invitationId), 0);
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
