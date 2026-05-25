/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfGenerationOptionsSchema = exports.printInvitationConfigSchema = exports.printCustomFontSizesSchema = exports.printCustomColorsSchema = exports.printTemplateSchema = exports.paperSizeSchema = exports.printLayoutTypeSchema = exports.printContentElementsSchema = exports.qrCodeConfigSchema = exports.qrCodeSizeSchema = exports.qrCodePositionSchema = void 0;
const zod_1 = require("zod");
exports.qrCodePositionSchema = zod_1.z.enum(['top-right', 'bottom-center', 'bottom-right']);
exports.qrCodeSizeSchema = zod_1.z.enum(['small', 'medium', 'large']);
exports.qrCodeConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    url: zod_1.z.string().url(),
    position: exports.qrCodePositionSchema,
    size: exports.qrCodeSizeSchema,
    label: zod_1.z.string().optional(),
});
exports.printContentElementsSchema = zod_1.z.object({
    message: zod_1.z.boolean(),
    gallery: zod_1.z.boolean(),
    galleryImageCount: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]),
    transport: zod_1.z.boolean(),
    contactInfo: zod_1.z.boolean(),
    accountInfo: zod_1.z.boolean(),
    qrCode: exports.qrCodeConfigSchema,
});
exports.printLayoutTypeSchema = zod_1.z.enum(['single', 'double', 'bifold', 'trifold']);
exports.paperSizeSchema = zod_1.z.enum(['A5', 'A4', 'DL', 'custom']);
exports.printTemplateSchema = zod_1.z.enum([
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
exports.printCustomColorsSchema = zod_1.z.object({
    primary: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
    secondary: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
    text: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
    background: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
    accent: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
});
exports.printCustomFontSizesSchema = zod_1.z.object({
    title: zod_1.z.number().min(8).max(72).optional(),
    heading: zod_1.z.number().min(8).max(48).optional(),
    body: zod_1.z.number().min(6).max(24).optional(),
    caption: zod_1.z.number().min(6).max(16).optional(),
});
exports.printInvitationConfigSchema = zod_1.z.object({
    layoutType: exports.printLayoutTypeSchema,
    template: exports.printTemplateSchema,
    paperSize: exports.paperSizeSchema,
    elements: exports.printContentElementsSchema,
    customFontFamily: zod_1.z.string().optional(),
    customColors: exports.printCustomColorsSchema.optional(),
    customFontSizes: exports.printCustomFontSizesSchema.optional(),
    createdAt: zod_1.z.string().datetime().optional(),
    updatedAt: zod_1.z.string().datetime().optional(),
});
exports.pdfGenerationOptionsSchema = zod_1.z.object({
    config: exports.printInvitationConfigSchema,
    dpi: zod_1.z.union([zod_1.z.literal(300), zod_1.z.literal(600)]).optional(),
    colorMode: zod_1.z.enum(['CMYK', 'RGB']).optional(),
    bleed: zod_1.z.number().min(0).max(10).optional(),
});
//# sourceMappingURL=print-invitation.js.map
