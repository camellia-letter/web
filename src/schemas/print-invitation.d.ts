import { z } from 'zod';
export declare const qrCodePositionSchema: z.ZodEnum<{
    "top-right": "top-right";
    "bottom-center": "bottom-center";
    "bottom-right": "bottom-right";
}>;
export declare const qrCodeSizeSchema: z.ZodEnum<{
    small: "small";
    medium: "medium";
    large: "large";
}>;
export declare const qrCodeConfigSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    url: z.ZodString;
    position: z.ZodEnum<{
        "top-right": "top-right";
        "bottom-center": "bottom-center";
        "bottom-right": "bottom-right";
    }>;
    size: z.ZodEnum<{
        small: "small";
        medium: "medium";
        large: "large";
    }>;
    label: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const printContentElementsSchema: z.ZodObject<{
    message: z.ZodBoolean;
    gallery: z.ZodBoolean;
    galleryImageCount: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    transport: z.ZodBoolean;
    contactInfo: z.ZodBoolean;
    accountInfo: z.ZodBoolean;
    qrCode: z.ZodObject<{
        enabled: z.ZodBoolean;
        url: z.ZodString;
        position: z.ZodEnum<{
            "top-right": "top-right";
            "bottom-center": "bottom-center";
            "bottom-right": "bottom-right";
        }>;
        size: z.ZodEnum<{
            small: "small";
            medium: "medium";
            large: "large";
        }>;
        label: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const printLayoutTypeSchema: z.ZodEnum<{
    single: "single";
    double: "double";
    bifold: "bifold";
    trifold: "trifold";
}>;
export declare const paperSizeSchema: z.ZodEnum<{
    custom: "custom";
    A5: "A5";
    A4: "A4";
    DL: "DL";
}>;
export declare const printTemplateSchema: z.ZodEnum<{
    "classic-simple": "classic-simple";
    "classic-photo": "classic-photo";
    "modern-minimal": "modern-minimal";
    "modern-bifold": "modern-bifold";
    "romantic-floral": "romantic-floral";
    "romantic-bifold": "romantic-bifold";
    "elegant-gold": "elegant-gold";
    "nature-green": "nature-green";
    "vintage-beige": "vintage-beige";
}>;
export declare const printCustomColorsSchema: z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    secondary: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodString>;
    accent: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const printCustomFontSizesSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodNumber>;
    heading: z.ZodOptional<z.ZodNumber>;
    body: z.ZodOptional<z.ZodNumber>;
    caption: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const printInvitationConfigSchema: z.ZodObject<{
    layoutType: z.ZodEnum<{
        single: "single";
        double: "double";
        bifold: "bifold";
        trifold: "trifold";
    }>;
    template: z.ZodEnum<{
        "classic-simple": "classic-simple";
        "classic-photo": "classic-photo";
        "modern-minimal": "modern-minimal";
        "modern-bifold": "modern-bifold";
        "romantic-floral": "romantic-floral";
        "romantic-bifold": "romantic-bifold";
        "elegant-gold": "elegant-gold";
        "nature-green": "nature-green";
        "vintage-beige": "vintage-beige";
    }>;
    paperSize: z.ZodEnum<{
        custom: "custom";
        A5: "A5";
        A4: "A4";
        DL: "DL";
    }>;
    elements: z.ZodObject<{
        message: z.ZodBoolean;
        gallery: z.ZodBoolean;
        galleryImageCount: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
        transport: z.ZodBoolean;
        contactInfo: z.ZodBoolean;
        accountInfo: z.ZodBoolean;
        qrCode: z.ZodObject<{
            enabled: z.ZodBoolean;
            url: z.ZodString;
            position: z.ZodEnum<{
                "top-right": "top-right";
                "bottom-center": "bottom-center";
                "bottom-right": "bottom-right";
            }>;
            size: z.ZodEnum<{
                small: "small";
                medium: "medium";
                large: "large";
            }>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    customFontFamily: z.ZodOptional<z.ZodString>;
    customColors: z.ZodOptional<z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        secondary: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        background: z.ZodOptional<z.ZodString>;
        accent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    customFontSizes: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodNumber>;
        heading: z.ZodOptional<z.ZodNumber>;
        body: z.ZodOptional<z.ZodNumber>;
        caption: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const pdfGenerationOptionsSchema: z.ZodObject<{
    config: z.ZodObject<{
        layoutType: z.ZodEnum<{
            single: "single";
            double: "double";
            bifold: "bifold";
            trifold: "trifold";
        }>;
        template: z.ZodEnum<{
            "classic-simple": "classic-simple";
            "classic-photo": "classic-photo";
            "modern-minimal": "modern-minimal";
            "modern-bifold": "modern-bifold";
            "romantic-floral": "romantic-floral";
            "romantic-bifold": "romantic-bifold";
            "elegant-gold": "elegant-gold";
            "nature-green": "nature-green";
            "vintage-beige": "vintage-beige";
        }>;
        paperSize: z.ZodEnum<{
            custom: "custom";
            A5: "A5";
            A4: "A4";
            DL: "DL";
        }>;
        elements: z.ZodObject<{
            message: z.ZodBoolean;
            gallery: z.ZodBoolean;
            galleryImageCount: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
            transport: z.ZodBoolean;
            contactInfo: z.ZodBoolean;
            accountInfo: z.ZodBoolean;
            qrCode: z.ZodObject<{
                enabled: z.ZodBoolean;
                url: z.ZodString;
                position: z.ZodEnum<{
                    "top-right": "top-right";
                    "bottom-center": "bottom-center";
                    "bottom-right": "bottom-right";
                }>;
                size: z.ZodEnum<{
                    small: "small";
                    medium: "medium";
                    large: "large";
                }>;
                label: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>;
        customFontFamily: z.ZodOptional<z.ZodString>;
        customColors: z.ZodOptional<z.ZodObject<{
            primary: z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            background: z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        customFontSizes: z.ZodOptional<z.ZodObject<{
            title: z.ZodOptional<z.ZodNumber>;
            heading: z.ZodOptional<z.ZodNumber>;
            body: z.ZodOptional<z.ZodNumber>;
            caption: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    dpi: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<300>, z.ZodLiteral<600>]>>;
    colorMode: z.ZodOptional<z.ZodEnum<{
        CMYK: "CMYK";
        RGB: "RGB";
    }>>;
    bleed: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
