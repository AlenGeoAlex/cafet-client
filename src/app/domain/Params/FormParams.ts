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
