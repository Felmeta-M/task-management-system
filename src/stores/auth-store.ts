// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

import { create } from "zustand";

// type AuthState = {
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       isAuthenticated: false,
//       login: (token) => set({ token, isAuthenticated: true }),
//       logout: () => set({ token: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

type AuthState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));