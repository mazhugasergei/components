import { create } from "zustand"

interface AppState {
	codeBlockTheme: any
	setCodeBlockTheme: (theme: any) => void
}

export const useStore = create<AppState>((set) => ({
	codeBlockTheme: null,
	setCodeBlockTheme: (theme) => set({ codeBlockTheme: theme }),
}))
