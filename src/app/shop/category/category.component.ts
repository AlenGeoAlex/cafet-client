import {Component, Input, OnInit} from '@angular/core';
import {IDailyStock} from "../../domain/IDailyStock";
import {ICartData} from "../../domain/ICart";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input("categoryName") categoryName : string
  @Input("categoryStock") categoryStock : IDailyStock[]
  @Input("categoryCart") categoryCart : ICartData[] | undefined;

  constructor() { }

  ngOnInit(): void {
    if(this.categoryName == null)
      throw new Error("Category Name should be present")

  }

  getCartOrNot(foodId : number) : ICartData | null {
    if(this.categoryCart == undefined)
      return null;

    const index = this.categoryCart.findIndex(s => s.foodId === foodId);
    if(index <= -1){
      return null;
    }

    return this.categoryCart[index];
  }

}
