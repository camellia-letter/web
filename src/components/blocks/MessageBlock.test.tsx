import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MessageBlock } from './MessageBlock';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DEFAULT_THEME } from '@camellia-letter/shared-types';

describe('MessageBlock', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <MantineProvider>
        <ThemeProvider theme={DEFAULT_THEME}>{ui}</ThemeProvider>
      </MantineProvider>,
    );
  };

  it('제목과 내용이 표시된다', () => {
    const data = {
      title: '결혼합니다',
      content: '두 사람이 하나가 되는 날',
    };

    renderWithTheme(<MessageBlock data={data} />);

    expect(screen.getByText('결혼합니다')).toBeInTheDocument();
    expect(screen.getByText('두 사람이 하나가 되는 날')).toBeInTheDocument();
  });

  it('제목만 있을 때도 렌더링된다', () => {
    const data = {
      title: '결혼합니다',
    };

    renderWithTheme(<MessageBlock data={data} />);

    expect(screen.getByText('결혼합니다')).toBeInTheDocument();
  });

  it('내용만 있을 때도 렌더링된다', () => {
    const data = {
      content: '두 사람이 하나가 되는 날',
    };

    renderWithTheme(<MessageBlock data={data} />);

    expect(screen.getByText('두 사람이 하나가 되는 날')).toBeInTheDocument();
  });

  it('제목과 내용이 모두 없으면 null을 반환한다', () => {
    const data = {};

    renderWithTheme(<MessageBlock data={data} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
