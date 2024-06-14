import "server-only";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { randomFillSync } from "crypto";
import prisma from "@/lib/prismadb";
import type { BackendTokens } from "@/objects";
import { SignJWT, jwtVerify } from "jose";

export const jwtConfig = {
	secret: new TextEncoder().encode(process.env.JWT_SECRET),
	refreshSecret: new TextEncoder().encode(process.env.JWT_REFRESH_SECRET),
	reset: new TextEncoder().encode(process.env.JWT_RESET_SECRET)
};

export async function getAuth(req: Request): Promise<string> {
	const authHeader = req.headers.get("authorization");
	const token = authHeader?.split(" ")[1];
	if (!token) {
		throw new Error("No está autorizado");
	}
	try {
		const decoded = await jwtVerify(token, jwtConfig.secret);
		return decoded.payload?.id as string;
	} catch (_error) {
		throw new Error("Token inválido o expirado");
	}
}

export async function refreshSession(token: string): Promise<BackendTokens> {
	try {
		const decoded = await jwtVerify(token, jwtConfig.refreshSecret);
		const userId = decoded.payload?.id;

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

export function generatePassword(
	length = 6,
	characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
) {
	return Array.from(randomFillSync(new Uint8Array(length)))
		.map(x => characters[x % characters.length])
		.join("");
}

export async function authorizeUser(userId: string) {
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

	const user = await prisma.user.update({
		where: { id: userId },
		data: {
			lastLogin: new Date()
		},
		select: {
			id: true,
			email: true,
			name: true,
			lastName: true,
			rol: true,
			createdAt: true,
			updatedAt: true
		}
	});

	return {
		user,
		backendTokens: {
			accessToken: {
				token: accessToken,
				expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()
			},
			refreshToken: {
				token: refreshToken,
				expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).getTime()
			}
		}
	};
}
