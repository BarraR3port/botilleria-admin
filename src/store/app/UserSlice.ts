import { toast } from "@/components/ui/use-toast";
import type { BackendTokens, UserAuthData, UserResponse } from "@/objects";

import type { User } from "@prisma/client";
import type { StateCreator } from "zustand";

export interface UserSlice {
	backendTokens: BackendTokens | null;
	user: User | null;
	signedIn: boolean;
	loggingIn: boolean;
	signingOut: boolean;
	signOut: () => Promise<boolean>;
	assignUserDetails: (user: UserAuthData) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = set => ({
	backendTokens: null,
	user: null,
	loggingIn: false,
	signedIn: false,
	signingOut: false,
	signOut: async () => {
		set({ backendTokens: null, user: null, signedIn: false });
		return true;
	},
	assignUserDetails: ({ user, backendTokens }) => {
		set({ user, backendTokens, signedIn: true, loggingIn: false });
	}
});
