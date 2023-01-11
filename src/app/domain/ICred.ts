
export interface ICred {
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  accessToken: string;
  refreshToken?: any;
  imageLink: any;
  cartId: any;
}

class Cred implements ICred {
  accessToken: string;
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  refreshToken?: any;
  cartId: any;
  imageLink: any;

}
