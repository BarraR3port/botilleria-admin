import type { BackendTokens } from "@/objects";
import { SignJWT, jwtVerify } from "jose";

export const jwtConfig = {
	secret: new TextEncoder().encode(process.env.JWT_SECRET),
	refreshSecret: new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
};

export async function getAuth(req: Request): Promise<string> {
	const authHeader = req.headers.get("authorization");
	const token = authHeader?.split(" ")[1];
	if (!token) {
		throw new Error("No está autorizado");
	}
	try {
		const decoded = await jwtVerify(token, jwtConfig.secret);
		return decoded.payload?._id as string;
	} catch (_error) {
		throw new Error("Token inválido o expirado");
	}
}

export async function refreshSession(token: string): Promise<BackendTokens> {
	try {
		const decoded = await jwtVerify(token, jwtConfig.refreshSecret);
		const userId = decoded.payload?._id;

		const accessToken = await new SignJWT({ id: userId })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1d")
			.sign(jwtConfig.secret);
		const refreshToken = await new SignJWT({ id: userId })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1w")
			.sign(jwtConfig.refreshSecret);

		return {
			accessToken: {
				token: accessToken,
				expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()
			},
			refreshToken: {
				token: refreshToken,
				expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).getTime()
			}
		};
	} catch (error) {
		console.error(error);
		throw new Error("Refresh Token inválido o expirado");
	}
}
