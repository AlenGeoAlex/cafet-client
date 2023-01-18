import {IEmailQuery} from "./IEmailQuery";
import {SelectedFood} from "./IFood";
import {StaffOrder} from "./StaffOrder";

export class StaffFoodOrder {

  constructor(user: IEmailQuery, selectedFood: StaffOrder[], paymentMethod: boolean) {
    this.user = user;
    this.selectedFood = selectedFood;
    this.paymentMethod = paymentMethod;
  }

  user : IEmailQuery;
  selectedFood : StaffOrder[];
  paymentMethod : boolean;
}
