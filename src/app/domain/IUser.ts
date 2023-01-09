
export interface IUser {
  UserEmailAddress: string;
  UserFullName: string;
  UserRole: string;
  AccessToken: string;
  RefreshToken?: any;
  ImageLink: any;
  CartId: any;
}

class User implements IUser {
  AccessToken: string;
  UserEmailAddress: string;
  UserFullName: string;
  UserRole: string;
  RefreshToken?: any;
  CartId: any;
  ImageLink: any;

}
