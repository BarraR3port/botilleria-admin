import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
					.catch(error => error.response);

				if (response.status === 401) {
					return null;
				}

				if (response.status === 200 || response.status === 201) {
					if ("errors" in response.data) {
						throw new Error(response.data.errors[0].message);
					}
					if (response.data?.user?.verifiedEmail === false) {
						console.log("Email not verified");
						response.status = 301;
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
	}
});
