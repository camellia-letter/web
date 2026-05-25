/**
 * 실물 청첩장 PDF 출력 관련 Zod 스키마
 */

import { z } from 'zod';

/**
 * QR 코드 위치 스키마
 */
export const qrCodePositionSchema = z.enum(['top-right', 'bottom-center', 'bottom-right']);

/**
 * QR 코드 크기 스키마
 */
export const qrCodeSizeSchema = z.enum(['small', 'medium', 'large']);

/**
 * QR 코드 설정 스키마
 */
export const qrCodeConfigSchema = z.object({
  enabled: z.boolean(),
  url: z.string().url(),
  position: qrCodePositionSchema,
  size: qrCodeSizeSchema,
  label: z.string().optional(),
});

/**
 * 포함할 콘텐츠 요소 스키마
 */
export const printContentElementsSchema = z.object({
  message: z.boolean(),
  gallery: z.boolean(),
  galleryImageCount: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  transport: z.boolean(),
  contactInfo: z.boolean(),
  accountInfo: z.boolean(),
  qrCode: qrCodeConfigSchema,
});

/**
 * 레이아웃 타입 스키마
 */
export const printLayoutTypeSchema = z.enum(['single', 'double', 'bifold', 'trifold']);

/**
 * 용지 크기 스키마
 */
export const paperSizeSchema = z.enum(['A5', 'A4', 'DL', 'custom']);

/**
 * 템플릿 스키마
 */
export const printTemplateSchema = z.enum([
  'classic-simple',
  'classic-photo',
  'modern-minimal',
  'modern-bifold',
  'romantic-floral',
  'romantic-bifold',
  'elegant-gold',
  'nature-green',
  'vintage-beige',
]);

/**
 * 커스텀 색상 스키마
 */
export const printCustomColorsSchema = z.object({
  primary: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  secondary: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  text: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  background: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  accent: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

/**
 * 커스텀 폰트 크기 스키마
 */
export const printCustomFontSizesSchema = z.object({
  title: z.number().min(8).max(72).optional(),
  heading: z.number().min(8).max(48).optional(),
  body: z.number().min(6).max(24).optional(),
  caption: z.number().min(6).max(16).optional(),
});

/**
 * 실물 청첩장 설정 스키마
 */
export const printInvitationConfigSchema = z.object({
  layoutType: printLayoutTypeSchema,
  template: printTemplateSchema,
  paperSize: paperSizeSchema,
  elements: printContentElementsSchema,
  customFontFamily: z.string().optional(),
  customColors: printCustomColorsSchema.optional(),
  customFontSizes: printCustomFontSizesSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * PDF 생성 옵션 스키마
 */
export const pdfGenerationOptionsSchema = z.object({
  config: printInvitationConfigSchema,
  dpi: z.union([z.literal(300), z.literal(600)]).optional(),
  colorMode: z.enum(['CMYK', 'RGB']).optional(),
  bleed: z.number().min(0).max(10).optional(),
});
