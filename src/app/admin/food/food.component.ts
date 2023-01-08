import { Component, OnInit } from '@angular/core';
import {IFood} from "../../domain/IFood";
import {FoodService} from "./food.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  foods : IFood[];

  constructor(private readonly foodService: FoodService, private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(){
    this.foodService.foodList$.subscribe({
      next: value => {
        this.foods = value;
      },
      error: err => {
        this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to load foods from server"})
        console.log(err);
      },
      complete: () => {

      }
    })
  }

  onFoodDelete($event: any) {
      if($event){
        this.messageService.add({severity: "success", summary: "Deleted", detail: "Successfully deleted the food"})
        this.loadFoods();
      }else{
        this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to delete the food"})
      }
  }

  onFoodRegSuccess($event: any) {
    if($event){
      this.messageService.add({severity: "success", summary: "Success", detail: "Successfully registered the new food item"})
      this.loadFoods();
    }else{
      this.messageService.add({severity: "error", summary: "Error", detail: "Failed to register the food"})
    }
  }
}
