import { Request } from 'express';
import { Types } from 'mongoose';
export interface JwtPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface SignupBody {
    fullName: string;
    email: string;
    password: string;
}
export interface LoginBody {
    email: string;
    password: string;
}
export interface PublicUser {
    id: string;
    email: string;
    fullName?: string;
    avatar?: string;
    currency: string;
    timezone: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LoginResponseData {
    token: string;
    user: PublicUser;
}
export interface SignupResponseData {
    user: PublicUser;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export interface IUser {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    authProvider: 'local' | 'google';
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    fullName?: string;
    avatar?: string;
    currency: string;
    timezone: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IBlacklistedToken {
    _id: Types.ObjectId;
    token: string;
    createdAt: Date;
}
//# sourceMappingURL=auth.types.d.ts.map