import { describe, it, expect } from "vitest";
import {
  CreateInvitationDtoSchema,
  UpdateInvitationDtoSchema,
  CreateRsvpDtoSchema,
  CreateGuestBookDtoSchema,
} from "../../schemas";

describe('CreateInvitationDtoSchema', () => {
  const validData = {
    groomName: '김철수',
    brideName: '이영희',
    weddingDate: '2025-06-15T14:00:00.000Z',
    venue: '더파티움',
    venueAddress: '서울시 강남구 역삼동 123',
  };

  it('should validate correct data', () => {
    const result = CreateInvitationDtoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require groomName', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      groomName: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require brideName', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      brideName: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require venue', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      venue: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require venueAddress', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      venueAddress: '',
    });
    expect(result.success).toBe(false);
  });

  it('should validate weddingDate as ISO string', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      weddingDate: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid ISO 8601 dates', () => {
    const dates = [
      '2025-06-15',
      '2025-06-15T14:00:00Z',
      '2025-06-15T14:00:00.000Z',
      '2025-12-25T10:30:00+09:00',
    ];

    dates.forEach((date) => {
      const result = CreateInvitationDtoSchema.safeParse({
        ...validData,
        weddingDate: date,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should allow optional slug', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      slug: 'my-wedding',
    });
    expect(result.success).toBe(true);
  });

  it('should validate slug format', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      slug: 'Invalid Slug!',
    });
    expect(result.success).toBe(false);
  });

  it('should accept slug with lowercase, numbers, and hyphens', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      ...validData,
      slug: 'kim-lee-2025',
    });
    expect(result.success).toBe(true);
  });
});

describe('UpdateInvitationDtoSchema', () => {
  it('should allow all fields to be optional', () => {
    const result = UpdateInvitationDtoSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should validate blocks with unique order', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      blocks: [
        { id: '1', type: 'HERO', order: 0, data: { imageUrl: '' } },
        { id: '2', type: 'MESSAGE', order: 1, data: {} },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('should reject blocks with duplicate order', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      blocks: [
        { id: '1', type: 'HERO', order: 0, data: { imageUrl: '' } },
        { id: '2', type: 'MESSAGE', order: 0, data: {} },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('should allow null slug (for removal)', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      slug: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('CreateRsvpDtoSchema', () => {
  const validData = {
    invitationId: 'inv-123',
    name: '홍길동',
    attendance: 'attending' as const,
  };

  it('should validate correct data', () => {
    const result = CreateRsvpDtoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require invitationId', () => {
    const result = CreateRsvpDtoSchema.safeParse({
      ...validData,
      invitationId: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require name', () => {
    const result = CreateRsvpDtoSchema.safeParse({
      ...validData,
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should validate attendance enum', () => {
    const result = CreateRsvpDtoSchema.safeParse({
      ...validData,
      attendance: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should accept all valid attendance values', () => {
    const values = ['attending', 'not_attending', 'undecided'] as const;
    values.forEach((attendance) => {
      const result = CreateRsvpDtoSchema.safeParse({
        ...validData,
        attendance,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should validate phone number format', () => {
    const validPhones = ['010-1234-5678', '+82-10-1234-5678', '01012345678'];
    validPhones.forEach((phone) => {
      const result = CreateRsvpDtoSchema.safeParse({
        ...validData,
        phoneNumber: phone,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid phone numbers', () => {
    const invalidPhones = ['abc', '123', '12345678901234567890123'];
    invalidPhones.forEach((phone) => {
      const result = CreateRsvpDtoSchema.safeParse({
        ...validData,
        phoneNumber: phone,
      });
      expect(result.success).toBe(false);
    });
  });

  it('should validate guestCount range (1-10)', () => {
    expect(CreateRsvpDtoSchema.safeParse({ ...validData, guestCount: 0 }).success).toBe(false);
    expect(CreateRsvpDtoSchema.safeParse({ ...validData, guestCount: 1 }).success).toBe(true);
    expect(CreateRsvpDtoSchema.safeParse({ ...validData, guestCount: 10 }).success).toBe(true);
    expect(CreateRsvpDtoSchema.safeParse({ ...validData, guestCount: 11 }).success).toBe(false);
  });
});

describe('CreateGuestBookDtoSchema', () => {
  const validData = {
    invitationId: 'inv-123',
    name: '홍길동',
    message: '축하합니다!',
  };

  it('should validate correct data', () => {
    const result = CreateGuestBookDtoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require invitationId', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      invitationId: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require name', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require message', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('should require password to be at least 4 characters', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should accept password with 4+ characters', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      password: '1234',
    });
    expect(result.success).toBe(true);
  });

  it('should allow empty string password', () => {
    const result = CreateGuestBookDtoSchema.safeParse({
      ...validData,
      password: '',
    });
    expect(result.success).toBe(true);
  });

  it('should allow omitted password', () => {
    const result = CreateGuestBookDtoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('HexColorSchema (via ThemeColors in UpdateInvitationDto)', () => {
  it('should normalize 3-digit hex to 6-digit uppercase', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      theme: {
        preset: 'custom',
        colors: {
          primary: '#f00',
          secondary: '#0f0',
          background: '#00f',
          text: '#fff',
          accent: '#000',
        },
        fontFamily: 'pretendard',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme!.colors.primary).toBe('#FF0000');
      expect(result.data.theme!.colors.secondary).toBe('#00FF00');
      expect(result.data.theme!.colors.background).toBe('#0000FF');
      expect(result.data.theme!.colors.text).toBe('#FFFFFF');
      expect(result.data.theme!.colors.accent).toBe('#000000');
    }
  });

  it('should convert 6-digit hex to uppercase', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      theme: {
        preset: 'custom',
        colors: {
          primary: '#abcdef',
          secondary: '#123456',
          background: '#ffffff',
          text: '#000000',
          accent: '#aabbcc',
        },
        fontFamily: 'pretendard',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme!.colors.primary).toBe('#ABCDEF');
      expect(result.data.theme!.colors.secondary).toBe('#123456');
    }
  });

  it('should reject invalid hex colors', () => {
    const result = UpdateInvitationDtoSchema.safeParse({
      theme: {
        preset: 'custom',
        colors: {
          primary: 'red',
          secondary: '#123456',
          background: '#FFFFFF',
          text: '#000000',
          accent: '#AABBCC',
        },
        fontFamily: 'pretendard',
      },
    });

    expect(result.success).toBe(false);
  });
});

describe('SlugSchema', () => {
  it('should accept valid slugs', () => {
    const validSlugs = ['my-wedding', 'kim-lee', 'wedding-2025', 'abc'];
    validSlugs.forEach((slug) => {
      const result = CreateInvitationDtoSchema.safeParse({
        groomName: '김',
        brideName: '이',
        weddingDate: '2025-06-15',
        venue: '장소',
        venueAddress: '주소',
        slug,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should reject slugs with uppercase', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      groomName: '김',
      brideName: '이',
      weddingDate: '2025-06-15',
      venue: '장소',
      venueAddress: '주소',
      slug: 'My-Wedding',
    });
    expect(result.success).toBe(false);
  });

  it('should reject slugs with special characters', () => {
    const result = CreateInvitationDtoSchema.safeParse({
      groomName: '김',
      brideName: '이',
      weddingDate: '2025-06-15',
      venue: '장소',
      venueAddress: '주소',
      slug: 'my_wedding!',
    });
    expect(result.success).toBe(false);
  });

  it('should reject slugs starting or ending with hyphen', () => {
    const invalidSlugs = ['-my-wedding', 'my-wedding-'];
    invalidSlugs.forEach((slug) => {
      const result = CreateInvitationDtoSchema.safeParse({
        groomName: '김',
        brideName: '이',
        weddingDate: '2025-06-15',
        venue: '장소',
        venueAddress: '주소',
        slug,
      });
      expect(result.success).toBe(false);
    });
  });
});
