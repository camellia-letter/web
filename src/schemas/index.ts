import { z } from 'zod';

// ============================================
// Common Helpers & Enums
// ============================================

/** 필수 문자열 헬퍼 (한글 에러 메시지) */
export const requiredString = (fieldName: string) =>
  z.string().min(1, { message: `${fieldName}을(를) 입력해주세요.` });

/** BlockType enum 스키마 */
export const BlockTypeSchema = z.enum([
  'HERO',
  'MESSAGE',
  'INFO',
  'MAP',
  'GALLERY',
  'GUESTBOOK',
  'ACCOUNT',
  'TRANSPORT',
  'RSVP',
]);

/** AttendanceStatus enum 스키마 */
export const AttendanceStatusSchema = z.enum(['attending', 'not_attending', 'undecided']);

/** MealType enum 스키마 */
export const MealTypeSchema = z.enum(['standard', 'vegetarian', 'none']);

/** Side enum 스키마 */
export const SideSchema = z.enum(['groom', 'bride']);

/** ThemePreset enum 스키마 */
export const ThemePresetSchema = z.enum([
  'classic',
  'modern',
  'nature',
  'elegant',
  'romantic',
  'minimal',
  'spring',
  'summer',
  'autumn',
  'winter',
  'navy',
  'burgundy',
  'forest',
  'beach',
  'garden',
  'midnight',
  'sunset',
  'custom',
]);

/** FontFamily enum 스키마 */
export const FontFamilySchema = z.enum([
  'pretendard',
  'noto-serif',
  'gowun-batang',
  'nanum-myeongjo',
  'cafe24-surround',
]);

/** BorderRadius 스키마 */
export const BorderRadiusSchema = z.enum(['none', 'small', 'medium', 'large']);

// ============================================
// Invitation Schemas
// ============================================

// 슬러그 검증 (소문자, 숫자, 하이픈만 허용)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SlugSchema = z
  .string()
  .regex(slugRegex, {
    message: 'URL은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.',
  })
  .max(50, { message: 'URL은 50자 이하로 입력해주세요.' })
  .optional();

// HEX 색상 검증 (3자리 또는 6자리) + 6자리로 정규화
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const HexColorSchema = z
  .string()
  .regex(hexColorRegex, {
    message: '올바른 HEX 색상 코드를 입력해주세요. (예: #FF0000 또는 #F00)',
  })
  .transform((val) => {
    // 3자리 hex → 6자리 확장 + 대문자 통일
    const match = /^#([0-9a-fA-F]{3})$/.exec(val);
    if (match) {
      const [r, g, b] = match[1];
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return val.toUpperCase();
  });

// ThemeColors 스키마
const ThemeColorsSchema = z.object({
  primary: HexColorSchema,
  secondary: HexColorSchema,
  background: HexColorSchema,
  text: HexColorSchema,
  accent: HexColorSchema,
});

// GradientConfig 스키마
const GradientConfigSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(['linear', 'radial']),
  direction: z.enum(['to-b', 'to-t', 'to-r', 'to-l', 'to-br', 'to-bl', 'to-tr', 'to-tl']),
  fromColor: HexColorSchema,
  viaColor: HexColorSchema.optional(),
  toColor: HexColorSchema,
});

/** InvitationTheme 스키마 */
export const InvitationThemeSchema = z.object({
  preset: ThemePresetSchema,
  colors: ThemeColorsSchema,
  fontFamily: FontFamilySchema,
  borderRadius: BorderRadiusSchema.optional(),
  gradient: GradientConfigSchema.optional(),
});

// ---- Per-block data schemas ----
const HeroBlockDataSchema = z
  .object({ imageUrl: z.string(), altText: z.string().optional() })
  .passthrough();
const MessageBlockDataSchema = z
  .object({ title: z.string().optional(), content: z.string().optional() })
  .passthrough();
const InfoBlockDataSchema = z
  .object({
    groomName: z.string().optional(),
    brideName: z.string().optional(),
    weddingDate: z.string().optional(),
    venue: z.string().optional(),
    venueAddress: z.string().optional(),
  })
  .passthrough();
const MapBlockDataSchema = z
  .object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    venue: z.string().optional(),
    venueAddress: z.string().optional(),
  })
  .passthrough();
const GalleryBlockDataSchema = z
  .object({
    images: z.array(z.object({ url: z.string(), caption: z.string().optional() })).default([]),
  })
  .passthrough();
const GuestbookBlockDataSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    showPasswordField: z.boolean().optional(),
  })
  .passthrough();
const AccountBlockDataSchema = z
  .object({
    groomTitle: z.string().optional(),
    groomAccounts: z
      .array(z.object({ bank: z.string(), accountNumber: z.string(), holder: z.string() }))
      .default([]),
    brideTitle: z.string().optional(),
    brideAccounts: z
      .array(z.object({ bank: z.string(), accountNumber: z.string(), holder: z.string() }))
      .default([]),
  })
  .passthrough();
const TransportBlockDataSchema = z
  .object({
    title: z.string().optional(),
    items: z
      .array(
        z.object({
          type: z.enum(['subway', 'bus', 'car', 'shuttle', 'other']),
          title: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
    parkingInfo: z.string().optional(),
  })
  .passthrough();
const RsvpBlockDataSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    deadline: z.string().optional(),
    showMealOption: z.boolean().optional(),
    showGuestCount: z.boolean().optional(),
  })
  .passthrough();

/** InvitationBlock 스키마 (discriminated union) */
export const InvitationBlockSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('HERO'),
    order: z.number().int().nonnegative(),
    data: HeroBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('MESSAGE'),
    order: z.number().int().nonnegative(),
    data: MessageBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('INFO'),
    order: z.number().int().nonnegative(),
    data: InfoBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('MAP'),
    order: z.number().int().nonnegative(),
    data: MapBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('GALLERY'),
    order: z.number().int().nonnegative(),
    data: GalleryBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('GUESTBOOK'),
    order: z.number().int().nonnegative(),
    data: GuestbookBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('ACCOUNT'),
    order: z.number().int().nonnegative(),
    data: AccountBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('TRANSPORT'),
    order: z.number().int().nonnegative(),
    data: TransportBlockDataSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal('RSVP'),
    order: z.number().int().nonnegative(),
    data: RsvpBlockDataSchema,
  }),
]);

/** CreateInvitationDto 스키마 */
export const CreateInvitationDtoSchema = z.object({
  groomName: requiredString('신랑 이름').max(50, {
    message: '신랑 이름은 50자 이하로 입력해주세요.',
  }),
  brideName: requiredString('신부 이름').max(50, {
    message: '신부 이름은 50자 이하로 입력해주세요.',
  }),
  weddingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: '올바른 날짜 형식(ISO 8601)을 입력해주세요.',
  }),
  venue: requiredString('예식장 이름').max(100, {
    message: '예식장 이름은 100자 이하로 입력해주세요.',
  }),
  venueAddress: requiredString('예식장 주소').max(200, {
    message: '예식장 주소는 200자 이하로 입력해주세요.',
  }),
  venueLat: z
    .number()
    .min(-90, { message: '위도는 -90 이상이어야 합니다.' })
    .max(90, { message: '위도는 90 이하여야 합니다.' })
    .optional(),
  venueLng: z
    .number()
    .min(-180, { message: '경도는 -180 이상이어야 합니다.' })
    .max(180, { message: '경도는 180 이하여야 합니다.' })
    .optional(),
  slug: SlugSchema,
});

/** UpdateInvitationDto 스키마 */
export const UpdateInvitationDtoSchema = z.object({
  groomName: z.string().max(50, { message: '신랑 이름은 50자 이하로 입력해주세요.' }).optional(),
  brideName: z.string().max(50, { message: '신부 이름은 50자 이하로 입력해주세요.' }).optional(),
  weddingDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: '올바른 날짜 형식(ISO 8601)을 입력해주세요.',
    })
    .optional(),
  venue: z.string().max(100, { message: '예식장 이름은 100자 이하로 입력해주세요.' }).optional(),
  venueAddress: z
    .string()
    .max(200, { message: '예식장 주소는 200자 이하로 입력해주세요.' })
    .optional(),
  message: z.string().max(2000, { message: '메시지는 2000자 이하로 입력해주세요.' }).optional(),
  venueLat: z
    .number()
    .min(-90, { message: '위도는 -90 이상이어야 합니다.' })
    .max(90, { message: '위도는 90 이하여야 합니다.' })
    .nullable()
    .optional(),
  venueLng: z
    .number()
    .min(-180, { message: '경도는 -180 이상이어야 합니다.' })
    .max(180, { message: '경도는 180 이하여야 합니다.' })
    .nullable()
    .optional(),
  blocks: z
    .array(InvitationBlockSchema)
    .refine(
      (blocks) => {
        const orders = blocks.map((b) => b.order);
        return new Set(orders).size === orders.length;
      },
      { message: '블록 순서(order)가 중복됩니다. 각 블록은 고유한 순서를 가져야 합니다.' },
    )
    .optional(),
  theme: InvitationThemeSchema.optional(),
  slug: z
    .string()
    .regex(slugRegex, { message: 'URL은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.' })
    .max(50, { message: 'URL은 50자 이하로 입력해주세요.' })
    .nullable()
    .optional(),
});

// ============================================
// RSVP Schemas
// ============================================

// 전화번호 형식: 숫자, 하이픈, 공백, 괄호, +기호 허용 (8~20자)
const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
const PhoneNumberSchema = z.string().regex(phoneRegex, {
  message: '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)',
});

/** CreateRsvpDto 스키마 */
export const CreateRsvpDtoSchema = z.object({
  invitationId: requiredString('청첩장 ID'),
  name: requiredString('이름').max(50, { message: '이름은 50자 이하로 입력해주세요.' }),
  phoneNumber: PhoneNumberSchema.optional(),
  attendance: AttendanceStatusSchema,
  guestCount: z
    .number()
    .min(1, { message: '참석 인원은 1명 이상이어야 합니다.' })
    .max(10, { message: '참석 인원은 10명 이하로 입력해주세요.' })
    .optional(),
  mealType: MealTypeSchema.optional(),
  message: z.string().max(500, { message: '메시지는 500자 이하로 입력해주세요.' }).optional(),
  side: SideSchema.optional(),
});

/** UpdateRsvpDto 스키마 */
export const UpdateRsvpDtoSchema = z.object({
  attendance: AttendanceStatusSchema.optional(),
  guestCount: z
    .number()
    .min(1, { message: '참석 인원은 1명 이상이어야 합니다.' })
    .max(10, { message: '참석 인원은 10명 이하로 입력해주세요.' })
    .optional(),
  mealType: MealTypeSchema.optional(),
  message: z.string().max(500, { message: '메시지는 500자 이하로 입력해주세요.' }).optional(),
});

// ============================================
// Guestbook Schemas
// ============================================

/** CreateGuestBookDto 스키마 */
export const CreateGuestBookDtoSchema = z.object({
  invitationId: requiredString('청첩장 ID'),
  name: requiredString('이름').max(50, { message: '이름은 50자 이하로 입력해주세요.' }),
  message: requiredString('메시지').max(500, { message: '메시지는 500자 이하로 입력해주세요.' }),
  password: z
    .string()
    .min(4, { message: '비밀번호는 4자 이상 입력해주세요.' })
    .max(100, { message: '비밀번호는 100자 이하로 입력해주세요.' })
    .optional()
    .or(z.literal('')),
});

/** UpdateGuestBookDto 스키마 */
export const UpdateGuestBookDtoSchema = z.object({
  isVisible: z.boolean().optional(),
});

/** DeleteGuestBookDto 스키마 */
export const DeleteGuestBookDtoSchema = z.object({
  password: z.string().optional(),
});

// ============================================
// Type Inference
// ============================================

export type CreateInvitationDtoInput = z.input<typeof CreateInvitationDtoSchema>;
export type UpdateInvitationDtoInput = z.input<typeof UpdateInvitationDtoSchema>;
export type CreateRsvpDtoInput = z.input<typeof CreateRsvpDtoSchema>;
export type UpdateRsvpDtoInput = z.input<typeof UpdateRsvpDtoSchema>;
export type CreateGuestBookDtoInput = z.input<typeof CreateGuestBookDtoSchema>;
export type UpdateGuestBookDtoInput = z.input<typeof UpdateGuestBookDtoSchema>;
export type DeleteGuestBookDtoInput = z.input<typeof DeleteGuestBookDtoSchema>;

// ============================================
// Print Invitation Schemas (실물 청첩장 PDF 출력)
// ============================================

export * from './print-invitation';
