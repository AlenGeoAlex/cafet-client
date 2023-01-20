import {Component, Input, OnInit} from '@angular/core';
import {IDailyStock} from "../../domain/IDailyStock";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input("categoryName") categoryName : string
  @Input("categoryStock") categoryStock : IDailyStock[]

  constructor() { }

  ngOnInit(): void {
    if(this.categoryName == null)
      throw new Error("Category Name should be present")
  }

}
