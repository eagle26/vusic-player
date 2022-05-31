import type { UserDataInterface } from './UserDataInterface';

export interface UserRegistrationInterface extends UserDataInterface {
  password: string;
  confirm_password: string;
  tos: boolean;
}
