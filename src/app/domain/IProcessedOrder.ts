export interface IProcessedOrder {
  orderId: string;
  orderSuccessful: boolean;
  orderStatus: Map<number, boolean>;
  orderFoodQuantity: Map<number, number>;
  orderCost: number;
}
