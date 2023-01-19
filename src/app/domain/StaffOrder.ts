import {IDailyStock} from "./IDailyStock";

export class StaffOrder {
  public readonly foodId : number;
  public readonly foodName : string;
  public orderQuantity : number
  public readonly stockId : number;
  public readonly foodImage : string;
  public readonly foodPrice : number;
  public readonly foodType : boolean;


  constructor(stock : IDailyStock) {
    this.foodId = stock.foodId;
    this.foodName = stock.foodName;
    this.foodType = stock.foodType;
    this.orderQuantity = 1;
    this.stockId = stock.stockId;
    this.foodImage = stock.foodImage;
    this.foodPrice = stock.foodPrice;
  }
}
