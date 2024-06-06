import { jwtVerify } from "jose";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authorizeUser, jwtConfig, refreshSession } from "./utils";

export class CustomAuthError extends CredentialsSignin {
	code = "custom";
	constructor(message?: any, errorOptions?: any) {
		super(message, errorOptions);
		this.message = message;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				userId: {},
				token: {}
			},
			authorize: async credentials => {
				const { userId, token } = credentials;

				if (typeof userId !== "string" || typeof token !== "string") {
					throw new CustomAuthError("Credenciales inválidas");
				}

				try {
					const decoded = await jwtVerify(token, jwtConfig.secret);
					if (decoded.payload?.id) {
						return (await authorizeUser(decoded.payload.id as string)) as any;
					}
					throw new CustomAuthError("Token inválido");
				} catch (_error) {
					throw new CustomAuthError("Token inválido o expirado");
				}
			}
		})
	],
	pages: {
		signIn: "/signIn"
	},
	session: {
		strategy: "jwt"
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
			if (Date.now() > token.backendTokens.accessToken.expireAt) {
				const newBackendTokens = await refreshSession(token.backendTokens.refreshToken.token);
				token.backendTokens = newBackendTokens;
				session.user.backendTokens = newBackendTokens;
			}
			session.user = {
				...session.user,
				...token
			} as any;
			return session;
		}
	},
	trustHost: true
});
