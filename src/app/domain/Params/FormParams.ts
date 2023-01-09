export interface CategoryParams {
  CategoryName : string;
  CategoryDescription: string;
}

export interface FoodParam {
  FoodName: string;
  CategoryName: string;
  FoodDescription: string;
  FoodImage: File;
  FoodPrice: string;
}

export interface IRegistrationParams {
  firstName: string,
  lastName: string,
  emailAddress: string,
  password: string
  role: "ADMIN" | "STAFF" | "CUSTOMER",
}

export class RegistrationParam implements IRegistrationParams {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export interface ILoginParams {
  emailAddress: string,
  password: string,
}
