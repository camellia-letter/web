import { ErrorCode, ERROR_MESSAGES } from "@camellia-letter/shared-types";

export interface ParsedError {
  code: ErrorCode;
  message: string;
  isRetryable: boolean;
}

/**
 * HTTP 응답을 파싱하여 표준화된 에러 형식으로 변환
 */
export const parseApiError = (response: Response | null): ParsedError => {
  // 네트워크 에러
  if (!response) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
      isRetryable: true,
    };
  }

  // HTTP 상태 코드 기반 에러 처리
  const status = response.status;

  if (status === 404) {
    return {
      code: ErrorCode.NOT_FOUND,
      message: ERROR_MESSAGES[ErrorCode.NOT_FOUND],
      isRetryable: false,
    };
  }

  if (status === 401) {
    return {
      code: ErrorCode.UNAUTHORIZED,
      message: ERROR_MESSAGES[ErrorCode.UNAUTHORIZED],
      isRetryable: false,
    };
  }

  if (status === 403) {
    return {
      code: ErrorCode.FORBIDDEN,
      message: ERROR_MESSAGES[ErrorCode.FORBIDDEN],
      isRetryable: false,
    };
  }

  if (status >= 500) {
    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
      isRetryable: true,
    };
  }

  return {
    code: ErrorCode.VALIDATION_ERROR,
    message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
    isRetryable: false,
  };
};

/**
 * 재시도 로직이 포함된 fetch wrapper
 */
export const fetchWithRetry = async <T>(
  url: string,
  options?: RequestInit,
  maxRetries = 2,
): Promise<{ data: T | null; error: ParsedError | null }> => {
  let lastError: ParsedError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (res.ok) {
        const data = await res.json();
        return { data, error: null };
      }

      const parsedError = parseApiError(res);

      // 재시도 불가능한 에러면 즉시 반환
      if (!parsedError.isRetryable) {
        return { data: null, error: parsedError };
      }

      lastError = parsedError;

      // 마지막 시도가 아니면 대기 후 재시도
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    } catch {
      lastError = {
        code: ErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
        isRetryable: true,
      };

      // 마지막 시도가 아니면 대기 후 재시도
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  return { data: null, error: lastError };
};
