import { cache } from 'react';
import type { Invitation, InvitationStats } from '@camellia/shared-types';
import type { GuestBook, CreateGuestBookDto } from '@camellia/shared-types';
import type { Rsvp, CreateRsvpDto } from '@camellia/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';
const isDev = process.env.NODE_ENV === 'development';
const DEFAULT_TIMEOUT_MS = 10_000;

const logError = (message: string, error: unknown) => {
  if (isDev && typeof globalThis.reportError === 'function') {
    globalThis.reportError(error instanceof Error ? error : new Error(message));
  }
};

const fetchWithTimeout = (
  url: string,
  options?: RequestInit & { next?: { revalidate?: number } },
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timerId));
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUUID = (str: string): boolean => UUID_REGEX.test(str);

export const getInvitations = async (token?: string | null): Promise<Invitation[]> => {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetchWithTimeout(`${API_URL}/api/invitations`, {
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      return [];
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError('Failed to fetch invitations:', new Error(`Expected JSON but got ${contentType}`));
      return [];
    }

    const data = await res.json();
    return data.items;
  } catch (error) {
    logError('Failed to fetch invitations:', error);
    return [];
  }
};

export const getInvitationStats = async (id: string): Promise<InvitationStats | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/invitations/${id}/stats`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError(
        'Failed to fetch invitation stats:',
        new Error(`Expected JSON but got ${contentType}`),
      );
      return null;
    }

    return res.json();
  } catch (error) {
    logError('Failed to fetch invitation stats:', error);
    return null;
  }
};

export const getInvitation = async (id: string): Promise<Invitation | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/invitations/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError('Failed to fetch invitation:', new Error(`Expected JSON but got ${contentType}`));
      return null;
    }

    return res.json();
  } catch (error) {
    logError('Failed to fetch invitation:', error);
    return null;
  }
};

export const getInvitationBySlug = async (slug: string): Promise<Invitation | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/invitations/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError(
        'Failed to fetch invitation by slug:',
        new Error(`Expected JSON but got ${contentType}`),
      );
      return null;
    }

    return res.json();
  } catch (error) {
    logError('Failed to fetch invitation by slug:', error);
    return null;
  }
};

// 내부 구현 함수
const _getInvitationByIdOrSlug = async (idOrSlug: string): Promise<Invitation | null> => {
  if (isUUID(idOrSlug)) {
    return getInvitation(idOrSlug);
  }
  return getInvitationBySlug(idOrSlug);
};

// React.cache로 감싼 버전 export (서버 컴포넌트 렌더링당 1회만 실행)
export const getInvitationByIdOrSlug = cache(_getInvitationByIdOrSlug);

export const getGuestbooks = async (invitationId: string): Promise<GuestBook[]> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/guestbooks?invitationId=${invitationId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError('Failed to fetch guestbooks:', new Error(`Expected JSON but got ${contentType}`));
      return [];
    }

    const data = await res.json();
    return data.items;
  } catch (error) {
    logError('Failed to fetch guestbooks:', error);
    return [];
  }
};

export const createGuestbook = async (data: CreateGuestBookDto): Promise<GuestBook | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/guestbooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to create guestbook');
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError('Failed to create guestbook:', new Error(`Expected JSON but got ${contentType}`));
      return null;
    }

    return res.json();
  } catch (error) {
    logError('Failed to create guestbook:', error);
    return null;
  }
};

export const deleteGuestbook = async (id: string, password?: string): Promise<boolean> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/guestbooks/${id}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    return res.ok;
  } catch (error) {
    logError('Failed to delete guestbook:', error);
    return false;
  }
};

export const createRsvp = async (data: CreateRsvpDto): Promise<Rsvp | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/rsvps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to create RSVP');
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError('Failed to create RSVP:', new Error(`Expected JSON but got ${contentType}`));
      return null;
    }

    return res.json();
  } catch (error) {
    logError('Failed to create RSVP:', error);
    return null;
  }
};

export const trackView = async (invitationId: string): Promise<void> => {
  try {
    await fetchWithTimeout(`${API_URL}/api/invitations/${invitationId}/view`, {
      method: 'POST',
    });
  } catch (error) {
    logError('Failed to track view:', error);
  }
};

export const trackShare = async (invitationId: string): Promise<void> => {
  try {
    await fetchWithTimeout(`${API_URL}/api/invitations/${invitationId}/share`, {
      method: 'POST',
    });
  } catch (error) {
    logError('Failed to track share:', error);
  }
};

export const exchangeSessionForJwt = async (
  userId: string,
  sessionToken: string,
): Promise<string | null> => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sessionToken }),
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logError(
        'Failed to exchange session for JWT:',
        new Error(`Expected JSON but got ${contentType}`),
      );
      return null;
    }

    const data = await res.json();
    return data.accessToken ?? null;
  } catch (error) {
    logError('Failed to exchange session for JWT:', error);
    return null;
  }
};
