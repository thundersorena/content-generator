import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  emailVerified: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'flowai-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
