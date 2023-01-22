export interface IDailyStock {
  stockId: number;
  foodId: number;
  foodName: string;
  foodImage: string;
  foodCategory: string;
  totalInStock: number;
  currentInStock: number;
  foodPrice: number;
  foodType: boolean;
  foodDescription : string;
}

export interface IShopStock extends IDailyStock {
  topSeller? : boolean;
}
