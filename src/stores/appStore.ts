import { create } from 'zustand'

type ThemeMode = 'dark' | 'light'
type Language = 'zh-CN' | 'en-US'

interface AppState {
  theme: ThemeMode
  language: Language
  sidebarCollapsed: boolean
  setTheme: (theme: ThemeMode) => void
  setLanguage: (lang: Language) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  language: 'zh-CN',
  sidebarCollapsed: false,

  setTheme: (theme: ThemeMode) => set({ theme }),
  setLanguage: (language: Language) => set({ language }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
