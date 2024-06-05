import axios from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { refreshSession } from "./utils";

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

				if (response?.status === 400) {
					throw new CustomAuthError(response.data.errors[0].message, response.data.errors[0].type);
				}

				if (response?.status === 200 || response?.status === 201) {
					if ("errors" in response.data) {
						throw new CustomAuthError(response.data.errors[0].message, response.data.errors[0].type);
					}
					return response.data;
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
