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
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { user, signOut, backendTokens } = useAppStore();

	async function redirectToSignIn() {
		router.replace("/signIn");
	}

	useEffect(() => {
		if (mounted) return;
		setMounted(true);
	}, [mounted]);

	useEffect(() => {
		if (!mounted) return;
		console.log(pathname, user);
		if (pathname === "/signIn" || pathname === "/signUp") return;
		if (!user) {
			redirectToSignIn();
		}
	}, [user, pathname, mounted]);

	return <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>;
}
