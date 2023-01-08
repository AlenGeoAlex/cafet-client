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
}

export interface ILoginParams {
  emailAddress: string,
  password: string,
}
