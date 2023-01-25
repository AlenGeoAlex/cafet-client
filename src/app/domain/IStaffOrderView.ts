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

export default function getOrderAmount(of : OrderedFood[]) : number {
  let cost = 0;

  for (let orderedFood of of) {
    cost += orderedFood.foodQuantity * orderedFood.foodPrice;
  }

  return cost;
}
