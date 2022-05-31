import type { FAuth } from '../Types';

export interface AuthInterface {
  isAuthModalOpen: boolean;
  isUserLoggedIn: boolean;
  userData: FAuth.User | null;
}
