export declare const EDITABLE_USER_FIELDS: readonly ["fullName", "avatar", "currency", "timezone"];
export type EditableUserField = (typeof EDITABLE_USER_FIELDS)[number];
export declare const SUPPORTED_CURRENCIES: readonly ["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD", "JPY", "CHF"];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export declare const SUPPORTED_TIMEZONES: readonly ["Asia/Kolkata", "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Europe/Paris", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];
export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];
export interface UpdateProfileBody {
    fullName?: string;
    avatar?: string;
    currency?: SupportedCurrency;
    timezone?: SupportedTimezone;
}
export interface UserProfileData {
    id: string;
    email: string;
    fullName?: string;
    avatar?: string;
    currency: string;
    timezone: string;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=user.types.d.ts.map