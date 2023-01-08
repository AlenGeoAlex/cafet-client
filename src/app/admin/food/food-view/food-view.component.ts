import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FoodService} from "../food.service";
import {IFood} from "../../../domain/IFood";
import {ConfirmationService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-food-view',
  templateUrl: './food-view.component.html',
  styleUrls: ['./food-view.component.scss']
})
export class FoodViewComponent implements OnInit {

  @Input() foods : IFood[];
  //foodData = new Map<string, IFood[]>;

  @Output() foodDelete = new EventEmitter();

  constructor(private readonly confirmationService: ConfirmationService, private readonly foodService: FoodService, private readonly router: Router) { }

  ngOnInit(): void {
  }



  getLengthOf(category: string) : number{
    let count = 0;

    for (let food of this.foods) {
      if(food.category === category)
        count++;
    }

    return count;
  }

  onDelete(food: IFood) {
      this.confirmationService.confirm({
        message: "Are you sure you want to delete the food from the registry?",
        accept: () => {
          this.foodService.deleteFood(food.foodId).subscribe({
            next: val => {
              this.foodDelete.emit(true);
            },
            error: err => {
              this.foodDelete.emit(false);
              console.log(err);
            },
            complete: () => {

            }
          })
        }
      })
  }

  onEdit(food : IFood){
    this.router.navigate(["/admin/food/edit/"+food.foodId])
  }
}
