import type { BackendTokens, User as PrismaUser } from "@/objects";
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: PrismaUser;
		backendTokens: BackendTokens;
	}
	interface User {
		user: PrismaUser;
		backendTokens: BackendTokens;
	}
}
declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `auth`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
		idToken?: string;
		user: PrismaUser;
		backendTokens: BackendTokens;
	}
}
