/**
 * weddingDate 문자열을 안전하게 Date로 파싱합니다.
 * Invalid Date인 경우 null을 반환합니다.
 */
export const safeParseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * 날짜를 한국어 형식으로 포맷합니다.
 * Invalid Date인 경우 fallback 문자열을 반환합니다.
 */
export const formatDateKR = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  fallback = '날짜 미정',
): string => {
  const date = safeParseDate(dateString);
  if (!date) return fallback;
  return date.toLocaleDateString('ko-KR', options);
};

/**
 * 날짜를 한국어 시간 형식으로 포맷합니다.
 * Invalid Date인 경우 fallback 문자열을 반환합니다.
 *
 * SSR hydration 일관성을 위해 수동으로 포맷팅합니다.
 */
export const formatTimeKR = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  fallback = '',
): string => {
  const date = safeParseDate(dateString);
  if (!date) return fallback;

  const hour12 = options?.hour12 ?? false;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (hour12) {
    const period = hours < 12 ? '오전' : '오후';
    const displayHour = hours % 12 || 12;
    const hourStr = String(displayHour).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    return `${period} ${hourStr}:${minuteStr}`;
  }

  const hourStr = String(hours).padStart(2, '0');
  const minuteStr = String(minutes).padStart(2, '0');
  return `${hourStr}:${minuteStr}`;
};
