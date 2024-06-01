"use client";

import { useAppStore } from "@/store/AppStore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

export type Props = {
	children: ReactNode;
};

const AuthContext = createContext({});

// This hook can be used to access the user info.
export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider(props: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { user, signOut, backendTokens } = useAppStore();

	async function redirectToSignIn() {
		await signOut();
		router.replace("/signIn");
	}

	useEffect(() => {
		if (!user) {
			if (pathname === "/signIn") return;
			redirectToSignIn();
			return;
		}
	}, [user, pathname, backendTokens]);

	return <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>;
}
