import {IDailyStock} from "./IDailyStock";
import {ICart, ICartData} from "./ICart";

export class Order {
  public readonly foodId : number;
  public readonly foodName : string;
  public orderQuantity : number
  public readonly foodImage : string;
  public readonly foodPrice : number;
  public readonly foodType : boolean;


  constructor(stock : IDailyStock | ICartData) {
    this.foodId = stock.foodId;
    this.foodName = stock.foodName;
    this.foodType = stock.foodType;
    this.orderQuantity = 1;
    this.foodImage = stock.foodImage;
    this.foodPrice = stock.foodPrice;
  }


}
