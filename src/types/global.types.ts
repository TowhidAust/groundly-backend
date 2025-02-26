import { USER_ROLES } from 'src/constants';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
}
