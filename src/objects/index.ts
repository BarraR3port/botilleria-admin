export type BackendToken = {
	token: string;
	expireAt: number;
};

export type BackendTokens = {
	accessToken: BackendToken;
	refreshToken: BackendToken;
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

type NestResponse = {
	message: string[];
	error: string;
	data: string;
	method: string;
	params: any;
	statusCode: number;
	url: string;
};

export type UserResponse = UserErrorResponse | NestResponse | "" | undefined | true;
