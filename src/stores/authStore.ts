import { create } from 'zustand'
import type { UserInfo } from '@/types'

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  isLoggedIn: boolean
  setAuth: (token: string, userInfo: UserInfo) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  userInfo: null,
  isLoggedIn: false,

  setAuth: (token: string, userInfo: UserInfo) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    set({ token, userInfo, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    set({ token: null, userInfo: null, isLoggedIn: false })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')
    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr) as UserInfo
        set({ token, userInfo, isLoggedIn: true })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    }
  },
}))

// Helper: check if the current user is admin
export function isAdmin(): boolean {
  const state = useAuthStore.getState()
  return state.userInfo?.role === 'admin'
}
