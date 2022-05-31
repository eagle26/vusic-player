import { defineStore, acceptHMRUpdate } from 'pinia';
import type { AuthInterface } from '../interfaces/AuthInterface';

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthInterface => ({
    isAuthModalOpen: false,
    isUserLoggedIn: false,
    userData: null,
  }),
  getters: {
    showAuthModal(state): boolean {
      return state.isAuthModalOpen;
    },
  },
  actions: {
    /* It toggles the AuthModal status */
    toggleModalStatus(): void {
      this.isAuthModalOpen = !this.isAuthModalOpen;
    },
    /* It toggles the authentication status */
    toggleUserAuthStatus(): void {
      this.isUserLoggedIn = !this.isUserLoggedIn;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
