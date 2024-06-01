import { toast } from "@/components/ui/use-toast";
import type { BackendTokens, UserResponse } from "@/objects";

import type { StateCreator } from "zustand";
import type { User } from "@prisma/client";

export interface UserSlice {
	backendTokens: BackendTokens | null;
	user: User | null;
	signedIn: boolean;
	loggingIn: boolean;
	signingOut: boolean;
	signOut: () => Promise<boolean>;
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
	}
});
