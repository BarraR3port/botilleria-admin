import type { BackendTokens } from "@/objects";

import type { StateCreator } from "zustand";

export interface UserSlice {
	backendTokens: BackendTokens | null;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = () => ({
	backendTokens: null
});
