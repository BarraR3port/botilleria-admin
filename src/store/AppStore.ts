import { create } from "zustand";
import { type StateStorage, createJSONStorage, persist } from "zustand/middleware";

import { type UserSlice, createUserSlice } from "./app/UserSlice";
import secureLocalStorage from "react-secure-storage";

// Custom storage object
const storage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		return (secureLocalStorage.getItem(name) as string) || null;
	},
	setItem: async (name: string, value: string): Promise<void> => {
		secureLocalStorage.setItem(name, value);
	},
	removeItem: async (name: string): Promise<void> => {
		secureLocalStorage.removeItem(name);
	}
};

export const useAppStore = create<UserSlice>()(
	persist(
		(...a) => ({
			...createUserSlice(...a)
		}),
		{
			name: "botilleria-admin",
			storage: createJSONStorage(() => storage)
		}
	)
);
