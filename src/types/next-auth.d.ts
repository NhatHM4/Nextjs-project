import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

interface IUser {
    _id: string;
    username: string;
    email: string;
    isVerify: boolean;
    type: string;
    role: string;
    image?: string;
}


declare module "next-auth" {

    interface Session {
        access_token: string;
        refresh_token: string;
        user: IUser & DefaultSession['user']
        accessTokenExpires: number;
        error: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
        accessTokenExpires: number;
        error: string;
    }
}