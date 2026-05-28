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
      // 버튼 클릭 확인용
      alert('카카오톡 공유 시작');

      if (!window.Kakao) {
        alert('에러: 카카오 SDK를 찾을 수 없습니다.');
        addToast('error', '카카오 SDK를 찾을 수 없습니다.');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        alert('에러: 카카오 SDK가 초기화되지 않았습니다.');
        addToast('error', '카카오 SDK가 초기화되지 않았습니다.');
        return;
      }

      if (!window.Kakao.Share) {
        alert('에러: 카카오 공유 기능을 사용할 수 없습니다.');
        addToast('error', '카카오 공유 기능을 사용할 수 없습니다.');
        return;
      }

      const templateId = process.env.NEXT_PUBLIC_KAKAO_TEMPLATE_ID;

      if (!templateId) {
        alert('에러: 카카오 템플릿 ID가 설정되지 않았습니다.');
        addToast('error', '카카오 템플릿 ID가 설정되지 않았습니다.');
        return;
      }

      alert(`템플릿 ID: ${templateId}`);

      // sendCustom 메서드 확인
      if (typeof window.Kakao.Share.sendCustom !== 'function') {
        alert('에러: sendCustom 메서드를 찾을 수 없습니다.');
        alert(`사용 가능한 메서드: ${Object.keys(window.Kakao.Share).join(', ')}`);
        return;
      }

      alert('sendCustom 호출 시작');

      // 날짜 형식 포맷팅
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

      alert('sendCustom 파라미터 준비 완료');

      const templateIdNum = parseInt(templateId, 10);
      const shareParams = {
        templateId: templateIdNum,
        templateArgs: {
          GROOM_NAME: groomName,
          BRIDE_NAME: brideName,
          WEDDING_DATE: formattedDateTime,
          VENUE: venue,
          THUMB: mainImageUrl || '',
          INVITATION_PATH: invitationPath,
        },
      };

      alert(`전달 파라미터: templateId=${templateIdNum}, INVITATION_PATH=${invitationPath}`);

      // sendCustom 방식 사용 - 카카오 개발자 콘솔에서 만든 템플릿 사용
      try {
        alert('sendCustom 호출 직전');
        window.Kakao.Share.sendCustom({
          ...shareParams,
          success: () => {
            alert('카카오톡 공유 성공!');
            trackShare(invitationId);
          },
          fail: (error) => {
            alert(`카카오톡 공유 실패: ${error.message}`);
            addToast('error', `카카오톡 공유 실패: ${error.message}`);
          },
        });
        alert('sendCustom 호출 직후');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        alert(`sendCustom 호출 중 에러: ${msg}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`카카오톡 공유 실패: ${errorMessage}`);
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
