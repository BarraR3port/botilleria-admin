import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

class InvalidLoginError extends CredentialsSignin {
	code = "Invalid identifier or password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {}
			},
			authorize: async credentials => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const { email, password } = credentials;

				const response = await axios
					.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signIn`, {
						email,
						password
					})
					.catch(error => {
						console.log("|| Error", error.response.data.errors[0].message);
						return error.response;
					});

				if (response?.status === 401) {
					return null;
				}

				if (response?.status === 200 || response?.status === 201) {
					if ("errors" in response.data) {
						console.log("|| Error", response.data.errors[0].message);
						throw new InvalidLoginError(response.data.errors[0].message);
					}
					return response.data;
				}

				return null;
			}
		})
	],
	pages: {
		signIn: "/signIn"
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.email = user.user.email;
				token.name = user.user.name;
				token.lastName = user.user.lastName;
				token.backendTokens = user.backendTokens;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = {
				...session.user,
				...token
			} as any;
			return session;
		}
	},
	trustHost: true
});

export function getAuth(req: Request): string {
	console.log("|| req.headers", req.headers);
	const authHeader = req.headers.get("Authorization");
	const token = authHeader?.split(" ")[1];
	if (!token) {
		throw new Error("No está autorizado");
	}

	try {
		const decoded: string | jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);
		return (decoded as jwt.JwtPayload).id;
	} catch (_error) {
		throw new Error("Token inválido o expirado");
	}
}
