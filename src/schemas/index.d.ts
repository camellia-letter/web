import { z } from 'zod';
export declare const requiredString: (fieldName: string) => z.ZodString;
export declare const BlockTypeSchema: z.ZodEnum<{
    HERO: "HERO";
    MESSAGE: "MESSAGE";
    INFO: "INFO";
    MAP: "MAP";
    GALLERY: "GALLERY";
    GUESTBOOK: "GUESTBOOK";
    ACCOUNT: "ACCOUNT";
    TRANSPORT: "TRANSPORT";
    RSVP: "RSVP";
}>;
export declare const AttendanceStatusSchema: z.ZodEnum<{
    attending: "attending";
    not_attending: "not_attending";
    undecided: "undecided";
}>;
export declare const MealTypeSchema: z.ZodEnum<{
    none: "none";
    standard: "standard";
    vegetarian: "vegetarian";
}>;
export declare const SideSchema: z.ZodEnum<{
    groom: "groom";
    bride: "bride";
}>;
export declare const ThemePresetSchema: z.ZodEnum<{
    classic: "classic";
    modern: "modern";
    nature: "nature";
    elegant: "elegant";
    romantic: "romantic";
    minimal: "minimal";
    spring: "spring";
    summer: "summer";
    autumn: "autumn";
    winter: "winter";
    navy: "navy";
    burgundy: "burgundy";
    forest: "forest";
    beach: "beach";
    garden: "garden";
    midnight: "midnight";
    sunset: "sunset";
    custom: "custom";
}>;
export declare const FontFamilySchema: z.ZodEnum<{
    pretendard: "pretendard";
    "noto-serif": "noto-serif";
    "gowun-batang": "gowun-batang";
    "nanum-myeongjo": "nanum-myeongjo";
    "cafe24-surround": "cafe24-surround";
}>;
export declare const BorderRadiusSchema: z.ZodEnum<{
    none: "none";
    small: "small";
    medium: "medium";
    large: "large";
}>;
export declare const InvitationThemeSchema: z.ZodObject<{
    preset: z.ZodEnum<{
        classic: "classic";
        modern: "modern";
        nature: "nature";
        elegant: "elegant";
        romantic: "romantic";
        minimal: "minimal";
        spring: "spring";
        summer: "summer";
        autumn: "autumn";
        winter: "winter";
        navy: "navy";
        burgundy: "burgundy";
        forest: "forest";
        beach: "beach";
        garden: "garden";
        midnight: "midnight";
        sunset: "sunset";
        custom: "custom";
    }>;
    colors: z.ZodObject<{
        primary: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        secondary: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        background: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        text: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        accent: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    }, z.core.$strip>;
    fontFamily: z.ZodEnum<{
        pretendard: "pretendard";
        "noto-serif": "noto-serif";
        "gowun-batang": "gowun-batang";
        "nanum-myeongjo": "nanum-myeongjo";
        "cafe24-surround": "cafe24-surround";
    }>;
    borderRadius: z.ZodOptional<z.ZodEnum<{
        none: "none";
        small: "small";
        medium: "medium";
        large: "large";
    }>>;
    gradient: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
        type: z.ZodEnum<{
            linear: "linear";
            radial: "radial";
        }>;
        direction: z.ZodEnum<{
            "to-b": "to-b";
            "to-t": "to-t";
            "to-r": "to-r";
            "to-l": "to-l";
            "to-br": "to-br";
            "to-bl": "to-bl";
            "to-tr": "to-tr";
            "to-tl": "to-tl";
        }>;
        fromColor: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        viaColor: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
        toColor: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const InvitationBlockSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"HERO">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        imageUrl: z.ZodString;
        altText: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"MESSAGE">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"INFO">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        groomName: z.ZodOptional<z.ZodString>;
        brideName: z.ZodOptional<z.ZodString>;
        weddingDate: z.ZodOptional<z.ZodString>;
        venue: z.ZodOptional<z.ZodString>;
        venueAddress: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"MAP">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        lat: z.ZodOptional<z.ZodNumber>;
        lng: z.ZodOptional<z.ZodNumber>;
        venue: z.ZodOptional<z.ZodString>;
        venueAddress: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"GALLERY">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        images: z.ZodDefault<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            caption: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"GUESTBOOK">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        showPasswordField: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"ACCOUNT">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        groomTitle: z.ZodOptional<z.ZodString>;
        groomAccounts: z.ZodDefault<z.ZodArray<z.ZodObject<{
            bank: z.ZodString;
            accountNumber: z.ZodString;
            holder: z.ZodString;
        }, z.core.$strip>>>;
        brideTitle: z.ZodOptional<z.ZodString>;
        brideAccounts: z.ZodDefault<z.ZodArray<z.ZodObject<{
            bank: z.ZodString;
            accountNumber: z.ZodString;
            holder: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"TRANSPORT">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        items: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                subway: "subway";
                bus: "bus";
                car: "car";
                shuttle: "shuttle";
                other: "other";
            }>;
            title: z.ZodString;
            description: z.ZodString;
        }, z.core.$strip>>>;
        parkingInfo: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"RSVP">;
    order: z.ZodNumber;
    data: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        deadline: z.ZodOptional<z.ZodString>;
        showMealOption: z.ZodOptional<z.ZodBoolean>;
        showGuestCount: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>;
}, z.core.$strip>], "type">;
export declare const CreateInvitationDtoSchema: z.ZodObject<{
    groomName: z.ZodString;
    brideName: z.ZodString;
    weddingDate: z.ZodString;
    venue: z.ZodString;
    venueAddress: z.ZodString;
    venueLat: z.ZodOptional<z.ZodNumber>;
    venueLng: z.ZodOptional<z.ZodNumber>;
    slug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateInvitationDtoSchema: z.ZodObject<{
    groomName: z.ZodOptional<z.ZodString>;
    brideName: z.ZodOptional<z.ZodString>;
    weddingDate: z.ZodOptional<z.ZodString>;
    venue: z.ZodOptional<z.ZodString>;
    venueAddress: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    venueLat: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    venueLng: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    blocks: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"HERO">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            imageUrl: z.ZodString;
            altText: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"MESSAGE">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"INFO">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            groomName: z.ZodOptional<z.ZodString>;
            brideName: z.ZodOptional<z.ZodString>;
            weddingDate: z.ZodOptional<z.ZodString>;
            venue: z.ZodOptional<z.ZodString>;
            venueAddress: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"MAP">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            lat: z.ZodOptional<z.ZodNumber>;
            lng: z.ZodOptional<z.ZodNumber>;
            venue: z.ZodOptional<z.ZodString>;
            venueAddress: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"GALLERY">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            images: z.ZodDefault<z.ZodArray<z.ZodObject<{
                url: z.ZodString;
                caption: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"GUESTBOOK">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            showPasswordField: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"ACCOUNT">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            groomTitle: z.ZodOptional<z.ZodString>;
            groomAccounts: z.ZodDefault<z.ZodArray<z.ZodObject<{
                bank: z.ZodString;
                accountNumber: z.ZodString;
                holder: z.ZodString;
            }, z.core.$strip>>>;
            brideTitle: z.ZodOptional<z.ZodString>;
            brideAccounts: z.ZodDefault<z.ZodArray<z.ZodObject<{
                bank: z.ZodString;
                accountNumber: z.ZodString;
                holder: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"TRANSPORT">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            items: z.ZodDefault<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    subway: "subway";
                    bus: "bus";
                    car: "car";
                    shuttle: "shuttle";
                    other: "other";
                }>;
                title: z.ZodString;
                description: z.ZodString;
            }, z.core.$strip>>>;
            parkingInfo: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"RSVP">;
        order: z.ZodNumber;
        data: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            deadline: z.ZodOptional<z.ZodString>;
            showMealOption: z.ZodOptional<z.ZodBoolean>;
            showGuestCount: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$loose>;
    }, z.core.$strip>], "type">>>;
    theme: z.ZodOptional<z.ZodObject<{
        preset: z.ZodEnum<{
            classic: "classic";
            modern: "modern";
            nature: "nature";
            elegant: "elegant";
            romantic: "romantic";
            minimal: "minimal";
            spring: "spring";
            summer: "summer";
            autumn: "autumn";
            winter: "winter";
            navy: "navy";
            burgundy: "burgundy";
            forest: "forest";
            beach: "beach";
            garden: "garden";
            midnight: "midnight";
            sunset: "sunset";
            custom: "custom";
        }>;
        colors: z.ZodObject<{
            primary: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            secondary: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            background: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            text: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            accent: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        }, z.core.$strip>;
        fontFamily: z.ZodEnum<{
            pretendard: "pretendard";
            "noto-serif": "noto-serif";
            "gowun-batang": "gowun-batang";
            "nanum-myeongjo": "nanum-myeongjo";
            "cafe24-surround": "cafe24-surround";
        }>;
        borderRadius: z.ZodOptional<z.ZodEnum<{
            none: "none";
            small: "small";
            medium: "medium";
            large: "large";
        }>>;
        gradient: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            type: z.ZodEnum<{
                linear: "linear";
                radial: "radial";
            }>;
            direction: z.ZodEnum<{
                "to-b": "to-b";
                "to-t": "to-t";
                "to-r": "to-r";
                "to-l": "to-l";
                "to-br": "to-br";
                "to-bl": "to-bl";
                "to-tr": "to-tr";
                "to-tl": "to-tl";
            }>;
            fromColor: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            viaColor: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
            toColor: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const CreateRsvpDtoSchema: z.ZodObject<{
    invitationId: z.ZodString;
    name: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    attendance: z.ZodEnum<{
        attending: "attending";
        not_attending: "not_attending";
        undecided: "undecided";
    }>;
    guestCount: z.ZodOptional<z.ZodNumber>;
    mealType: z.ZodOptional<z.ZodEnum<{
        none: "none";
        standard: "standard";
        vegetarian: "vegetarian";
    }>>;
    message: z.ZodOptional<z.ZodString>;
    side: z.ZodOptional<z.ZodEnum<{
        groom: "groom";
        bride: "bride";
    }>>;
}, z.core.$strip>;
export declare const UpdateRsvpDtoSchema: z.ZodObject<{
    attendance: z.ZodOptional<z.ZodEnum<{
        attending: "attending";
        not_attending: "not_attending";
        undecided: "undecided";
    }>>;
    guestCount: z.ZodOptional<z.ZodNumber>;
    mealType: z.ZodOptional<z.ZodEnum<{
        none: "none";
        standard: "standard";
        vegetarian: "vegetarian";
    }>>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CreateGuestBookDtoSchema: z.ZodObject<{
    invitationId: z.ZodString;
    name: z.ZodString;
    message: z.ZodString;
    password: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const UpdateGuestBookDtoSchema: z.ZodObject<{
    isVisible: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const DeleteGuestBookDtoSchema: z.ZodObject<{
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateInvitationDtoInput = z.input<typeof CreateInvitationDtoSchema>;
export type UpdateInvitationDtoInput = z.input<typeof UpdateInvitationDtoSchema>;
export type CreateRsvpDtoInput = z.input<typeof CreateRsvpDtoSchema>;
export type UpdateRsvpDtoInput = z.input<typeof UpdateRsvpDtoSchema>;
export type CreateGuestBookDtoInput = z.input<typeof CreateGuestBookDtoSchema>;
export type UpdateGuestBookDtoInput = z.input<typeof UpdateGuestBookDtoSchema>;
export type DeleteGuestBookDtoInput = z.input<typeof DeleteGuestBookDtoSchema>;
export * from './print-invitation';
