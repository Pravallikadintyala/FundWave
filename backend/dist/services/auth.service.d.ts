import { SignupBody, LoginBody, SignupResponseData, LoginResponseData } from '../types/auth.types';
export declare const signupUser: (body: SignupBody) => Promise<SignupResponseData>;
export declare const loginUser: (body: LoginBody) => Promise<LoginResponseData>;
export declare const logoutUser: (token: string) => Promise<void>;
export declare const getGoogleAuthUrl: () => string;
export declare const handleGoogleCallback: (code: string) => Promise<LoginResponseData>;
export declare const forgotPassword: (email: string) => Promise<void>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map