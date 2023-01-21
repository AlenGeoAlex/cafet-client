import {IEmailQuery} from "./IEmailQuery";
import {SelectedFood} from "./IFood";
import {Order} from "./Order";

export class FoodOrder {
  selectedFood : Order[];
  paymentMethod : boolean;

  constructor(selectedFood: Order[], paymentMethod: boolean) {
    this.selectedFood = selectedFood;
    this.paymentMethod = paymentMethod;
  }
}


export class StaffFoodOrder extends FoodOrder{

  constructor(user: IEmailQuery, selectedFood: Order[], paymentMethod: boolean) {
    super(selectedFood, paymentMethod);
    this.user = user;
  }

  user : IEmailQuery;
}

