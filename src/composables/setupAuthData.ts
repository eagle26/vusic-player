import firebase from '../includes/firebase';
import { useAuthStore } from '../store/authStore';

export function useSetupAuthData(): void {
  const currentUser = firebase.getCurrentUser();
  const authStore = useAuthStore();

  if (currentUser) {
    authStore.toggleUserAuthStatus();
    authStore.userData = currentUser;
  }
}
