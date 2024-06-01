"use client";

import { useAppStore } from "@/store/AppStore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

export type Props = {
	children: ReactNode;
};

const AuthContext = createContext({});

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
		console.log(pathname);
		if (!user) {
			if (pathname === "/signIn" || pathname === "/signUp") return;
			redirectToSignIn();
		}
	}, [user, pathname, backendTokens]);

	return <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>;
}
