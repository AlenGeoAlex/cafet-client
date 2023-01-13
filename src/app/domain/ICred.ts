
export interface ICred {
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  accessToken: string;
  refreshToken: string;
  imageLink: string;
  cartId: string;
  CartData: string;
}

class Cred implements ICred {
  accessToken: string;
  userEmailAddress: string;
  userFullName: string;
  userRole: string;
  refreshToken: string;
  cartId: string;
  imageLink: string;
  CartData: string;

}
