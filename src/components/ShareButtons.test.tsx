import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { ShareButtons } from "./ShareButtons";

// Toast mock
vi.mock('./ui/Toast', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

// API mock
vi.mock('@/lib/api', () => ({
  trackShare: vi.fn(),
}));

// Date utils mock
vi.mock('@/lib/dateUtils', () => ({
  formatDateKR: () => '2026년 3월 15일',
}));

describe('ShareButtons', () => {
  const mockProps = {
    invitationId: '1',
    groomName: '홍길동',
    brideName: '김영희',
    weddingDate: '2026-03-15',
    venue: '서울 웨딩홀',
    invitationUrl: 'https://example.com/wedding/1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('카카오톡 공유 버튼과 링크 복사 버튼이 렌더링된다', () => {
    renderWithProvider(<ShareButtons {...mockProps} />);

    expect(screen.getByText('카카오톡으로 공유하기')).toBeInTheDocument();
    expect(screen.getByText('링크 복사하기')).toBeInTheDocument();
  });

  it('링크 복사 버튼을 클릭하면 clipboard API가 호출된다', async () => {
    renderWithProvider(<ShareButtons {...mockProps} />);

    const copyButton = screen.getByText('링크 복사하기');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.invitationUrl);
    });
  });

  it('카카오톡 SDK가 준비되지 않으면 버튼이 비활성화된다', () => {
    // Kakao SDK 없음
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).Kakao;

    renderWithProvider(<ShareButtons {...mockProps} />);

    const kakaoButton = screen.getByRole('button', { name: '카카오톡으로 공유하기' });
    expect(kakaoButton).toBeDisabled();
  });
});
