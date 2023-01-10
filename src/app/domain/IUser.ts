
export interface IUser {
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  accessToken: string;
  refreshToken?: any;
  imageLink: any;
  cartId: any;
}

class User implements IUser {
  accessToken: string;
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  refreshToken?: any;
  cartId: any;
  imageLink: any;

}
