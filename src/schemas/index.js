/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGuestBookDtoSchema = exports.UpdateGuestBookDtoSchema = exports.CreateGuestBookDtoSchema = exports.UpdateRsvpDtoSchema = exports.CreateRsvpDtoSchema = exports.UpdateInvitationDtoSchema = exports.CreateInvitationDtoSchema = exports.InvitationBlockSchema = exports.InvitationThemeSchema = exports.BorderRadiusSchema = exports.FontFamilySchema = exports.ThemePresetSchema = exports.SideSchema = exports.MealTypeSchema = exports.AttendanceStatusSchema = exports.BlockTypeSchema = exports.requiredString = void 0;
const zod_1 = require("zod");
const requiredString = (fieldName) => zod_1.z.string().min(1, { message: `${fieldName}을(를) 입력해주세요.` });
exports.requiredString = requiredString;
exports.BlockTypeSchema = zod_1.z.enum([
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
exports.AttendanceStatusSchema = zod_1.z.enum(['attending', 'not_attending', 'undecided']);
exports.MealTypeSchema = zod_1.z.enum(['standard', 'vegetarian', 'none']);
exports.SideSchema = zod_1.z.enum(['groom', 'bride']);
exports.ThemePresetSchema = zod_1.z.enum([
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
exports.FontFamilySchema = zod_1.z.enum([
    'pretendard',
    'noto-serif',
    'gowun-batang',
    'nanum-myeongjo',
    'cafe24-surround',
]);
exports.BorderRadiusSchema = zod_1.z.enum(['none', 'small', 'medium', 'large']);
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SlugSchema = zod_1.z
    .string()
    .regex(slugRegex, {
    message: 'URL은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.',
})
    .max(50, { message: 'URL은 50자 이하로 입력해주세요.' })
    .optional();
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const HexColorSchema = zod_1.z
    .string()
    .regex(hexColorRegex, {
    message: '올바른 HEX 색상 코드를 입력해주세요. (예: #FF0000 또는 #F00)',
})
    .transform((val) => {
    const match = /^#([0-9a-fA-F]{3})$/.exec(val);
    if (match) {
        const [r, g, b] = match[1];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return val.toUpperCase();
});
const ThemeColorsSchema = zod_1.z.object({
    primary: HexColorSchema,
    secondary: HexColorSchema,
    background: HexColorSchema,
    text: HexColorSchema,
    accent: HexColorSchema,
});
const GradientConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    type: zod_1.z.enum(['linear', 'radial']),
    direction: zod_1.z.enum(['to-b', 'to-t', 'to-r', 'to-l', 'to-br', 'to-bl', 'to-tr', 'to-tl']),
    fromColor: HexColorSchema,
    viaColor: HexColorSchema.optional(),
    toColor: HexColorSchema,
});
exports.InvitationThemeSchema = zod_1.z.object({
    preset: exports.ThemePresetSchema,
    colors: ThemeColorsSchema,
    fontFamily: exports.FontFamilySchema,
    borderRadius: exports.BorderRadiusSchema.optional(),
    gradient: GradientConfigSchema.optional(),
});
const HeroBlockDataSchema = zod_1.z
    .object({ imageUrl: zod_1.z.string(), altText: zod_1.z.string().optional() })
    .passthrough();
const MessageBlockDataSchema = zod_1.z
    .object({ title: zod_1.z.string().optional(), content: zod_1.z.string().optional() })
    .passthrough();
const InfoBlockDataSchema = zod_1.z
    .object({
    groomName: zod_1.z.string().optional(),
    brideName: zod_1.z.string().optional(),
    weddingDate: zod_1.z.string().optional(),
    venue: zod_1.z.string().optional(),
    venueAddress: zod_1.z.string().optional(),
})
    .passthrough();
const MapBlockDataSchema = zod_1.z
    .object({
    lat: zod_1.z.number().optional(),
    lng: zod_1.z.number().optional(),
    venue: zod_1.z.string().optional(),
    venueAddress: zod_1.z.string().optional(),
})
    .passthrough();
const GalleryBlockDataSchema = zod_1.z
    .object({
    images: zod_1.z.array(zod_1.z.object({ url: zod_1.z.string(), caption: zod_1.z.string().optional() })).default([]),
})
    .passthrough();
const GuestbookBlockDataSchema = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    showPasswordField: zod_1.z.boolean().optional(),
})
    .passthrough();
const AccountBlockDataSchema = zod_1.z
    .object({
    groomTitle: zod_1.z.string().optional(),
    groomAccounts: zod_1.z
        .array(zod_1.z.object({ bank: zod_1.z.string(), accountNumber: zod_1.z.string(), holder: zod_1.z.string() }))
        .default([]),
    brideTitle: zod_1.z.string().optional(),
    brideAccounts: zod_1.z
        .array(zod_1.z.object({ bank: zod_1.z.string(), accountNumber: zod_1.z.string(), holder: zod_1.z.string() }))
        .default([]),
})
    .passthrough();
const TransportBlockDataSchema = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        type: zod_1.z.enum(['subway', 'bus', 'car', 'shuttle', 'other']),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
    }))
        .default([]),
    parkingInfo: zod_1.z.string().optional(),
})
    .passthrough();
const RsvpBlockDataSchema = zod_1.z
    .object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    deadline: zod_1.z.string().optional(),
    showMealOption: zod_1.z.boolean().optional(),
    showGuestCount: zod_1.z.boolean().optional(),
})
    .passthrough();
exports.InvitationBlockSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('HERO'),
        order: zod_1.z.number().int().nonnegative(),
        data: HeroBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('MESSAGE'),
        order: zod_1.z.number().int().nonnegative(),
        data: MessageBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('INFO'),
        order: zod_1.z.number().int().nonnegative(),
        data: InfoBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('MAP'),
        order: zod_1.z.number().int().nonnegative(),
        data: MapBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('GALLERY'),
        order: zod_1.z.number().int().nonnegative(),
        data: GalleryBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('GUESTBOOK'),
        order: zod_1.z.number().int().nonnegative(),
        data: GuestbookBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('ACCOUNT'),
        order: zod_1.z.number().int().nonnegative(),
        data: AccountBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('TRANSPORT'),
        order: zod_1.z.number().int().nonnegative(),
        data: TransportBlockDataSchema,
    }),
    zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('RSVP'),
        order: zod_1.z.number().int().nonnegative(),
        data: RsvpBlockDataSchema,
    }),
]);
exports.CreateInvitationDtoSchema = zod_1.z.object({
    groomName: (0, exports.requiredString)('신랑 이름').max(50, {
        message: '신랑 이름은 50자 이하로 입력해주세요.',
    }),
    brideName: (0, exports.requiredString)('신부 이름').max(50, {
        message: '신부 이름은 50자 이하로 입력해주세요.',
    }),
    weddingDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: '올바른 날짜 형식(ISO 8601)을 입력해주세요.',
    }),
    venue: (0, exports.requiredString)('예식장 이름').max(100, {
        message: '예식장 이름은 100자 이하로 입력해주세요.',
    }),
    venueAddress: (0, exports.requiredString)('예식장 주소').max(200, {
        message: '예식장 주소는 200자 이하로 입력해주세요.',
    }),
    venueLat: zod_1.z
        .number()
        .min(-90, { message: '위도는 -90 이상이어야 합니다.' })
        .max(90, { message: '위도는 90 이하여야 합니다.' })
        .optional(),
    venueLng: zod_1.z
        .number()
        .min(-180, { message: '경도는 -180 이상이어야 합니다.' })
        .max(180, { message: '경도는 180 이하여야 합니다.' })
        .optional(),
    slug: SlugSchema,
});
exports.UpdateInvitationDtoSchema = zod_1.z.object({
    groomName: zod_1.z.string().max(50, { message: '신랑 이름은 50자 이하로 입력해주세요.' }).optional(),
    brideName: zod_1.z.string().max(50, { message: '신부 이름은 50자 이하로 입력해주세요.' }).optional(),
    weddingDate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: '올바른 날짜 형식(ISO 8601)을 입력해주세요.',
    })
        .optional(),
    venue: zod_1.z.string().max(100, { message: '예식장 이름은 100자 이하로 입력해주세요.' }).optional(),
    venueAddress: zod_1.z
        .string()
        .max(200, { message: '예식장 주소는 200자 이하로 입력해주세요.' })
        .optional(),
    message: zod_1.z.string().max(2000, { message: '메시지는 2000자 이하로 입력해주세요.' }).optional(),
    venueLat: zod_1.z
        .number()
        .min(-90, { message: '위도는 -90 이상이어야 합니다.' })
        .max(90, { message: '위도는 90 이하여야 합니다.' })
        .nullable()
        .optional(),
    venueLng: zod_1.z
        .number()
        .min(-180, { message: '경도는 -180 이상이어야 합니다.' })
        .max(180, { message: '경도는 180 이하여야 합니다.' })
        .nullable()
        .optional(),
    blocks: zod_1.z
        .array(exports.InvitationBlockSchema)
        .refine((blocks) => {
        const orders = blocks.map((b) => b.order);
        return new Set(orders).size === orders.length;
    }, { message: '블록 순서(order)가 중복됩니다. 각 블록은 고유한 순서를 가져야 합니다.' })
        .optional(),
    theme: exports.InvitationThemeSchema.optional(),
    slug: zod_1.z
        .string()
        .regex(slugRegex, { message: 'URL은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.' })
        .max(50, { message: 'URL은 50자 이하로 입력해주세요.' })
        .nullable()
        .optional(),
});
const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
const PhoneNumberSchema = zod_1.z.string().regex(phoneRegex, {
    message: '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)',
});
exports.CreateRsvpDtoSchema = zod_1.z.object({
    invitationId: (0, exports.requiredString)('청첩장 ID'),
    name: (0, exports.requiredString)('이름').max(50, { message: '이름은 50자 이하로 입력해주세요.' }),
    phoneNumber: PhoneNumberSchema.optional(),
    attendance: exports.AttendanceStatusSchema,
    guestCount: zod_1.z
        .number()
        .min(1, { message: '참석 인원은 1명 이상이어야 합니다.' })
        .max(10, { message: '참석 인원은 10명 이하로 입력해주세요.' })
        .optional(),
    mealType: exports.MealTypeSchema.optional(),
    message: zod_1.z.string().max(500, { message: '메시지는 500자 이하로 입력해주세요.' }).optional(),
    side: exports.SideSchema.optional(),
});
exports.UpdateRsvpDtoSchema = zod_1.z.object({
    attendance: exports.AttendanceStatusSchema.optional(),
    guestCount: zod_1.z
        .number()
        .min(1, { message: '참석 인원은 1명 이상이어야 합니다.' })
        .max(10, { message: '참석 인원은 10명 이하로 입력해주세요.' })
        .optional(),
    mealType: exports.MealTypeSchema.optional(),
    message: zod_1.z.string().max(500, { message: '메시지는 500자 이하로 입력해주세요.' }).optional(),
});
exports.CreateGuestBookDtoSchema = zod_1.z.object({
    invitationId: (0, exports.requiredString)('청첩장 ID'),
    name: (0, exports.requiredString)('이름').max(50, { message: '이름은 50자 이하로 입력해주세요.' }),
    message: (0, exports.requiredString)('메시지').max(500, { message: '메시지는 500자 이하로 입력해주세요.' }),
    password: zod_1.z
        .string()
        .min(4, { message: '비밀번호는 4자 이상 입력해주세요.' })
        .max(100, { message: '비밀번호는 100자 이하로 입력해주세요.' })
        .optional()
        .or(zod_1.z.literal('')),
});
exports.UpdateGuestBookDtoSchema = zod_1.z.object({
    isVisible: zod_1.z.boolean().optional(),
});
exports.DeleteGuestBookDtoSchema = zod_1.z.object({
    password: zod_1.z.string().optional(),
});
__exportStar(require("./print-invitation"), exports);
//# sourceMappingURL=index.js.map
