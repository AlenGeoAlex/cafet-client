export interface IUser {
  userId: number,
  userName: string;
  userFirstName : string;
  userLastName : string;
  userEmail: string;
  userImage: string;
  walletBalance: number;
  userRole: string;
  activated: boolean;
  deleted: boolean;
}
