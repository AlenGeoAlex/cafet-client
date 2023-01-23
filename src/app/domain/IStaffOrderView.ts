export interface OrderedFood {
  foodId: number;
  foodName: string;
  foodCategory: string;
  foodType: boolean;
  foodPrice: number;
  foodQuantity: number;
  foodImageUrl: string;
}

export interface IStaffOrderView {
  orderId : string;
  orderedEmail: string;
  orderedDate: string;
  orderedTime: string;
  orderedUserName: string;
  isCompleted: boolean;
  isCancelled: boolean;
  orderedFoods: OrderedFood[];
}
