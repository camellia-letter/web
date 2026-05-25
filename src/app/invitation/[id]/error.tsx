'use client';

import { ErrorFallback } from '@/components/ErrorBoundary';

const Error = () => {
  return <ErrorFallback message="청첩장을 불러오는 중 오류가 발생했습니다" />;
};

export default Error;
