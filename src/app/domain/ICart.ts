export interface ICart {
  cartId: string;
  count: number;
  isValid: boolean;
  cartData: ICartData[];
  lastUpdated: string;
}

export interface ICartData {
  foodId: number;
  foodName: string;
  quantity: number;
  foodType: boolean;
  foodCategory: string;
  available: boolean;
  lastUpdated: string;
  foodImage : string;
  foodPrice : number;
}
