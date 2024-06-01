import type { User } from "@prisma/client";

export type BackendToken = {
	token: string;
	expireAt: number;
};

export type BackendTokens = {
	accessToken: BackendToken;
	refreshToken: BackendToken;
};

export type UserAuthData = {
	user: User;
	backendTokens: BackendTokens;
};

type ErrorType = "email" | "password" | "token" | "unknown";

export interface UserAuthError {
	type: "email" | "password" | "token";
	message: string;
}

export type UserErrorResponse = {
	type: ErrorType;
	errors: UserAuthError[];
};

export type UserResponse = UserErrorResponse | "" | undefined | true;
