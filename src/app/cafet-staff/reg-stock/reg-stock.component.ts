import { Component, OnInit } from '@angular/core';
import {IFood, SelectedFood} from "../../domain/IFood";
import {StockService} from "../services/stock.service";
import {finalize} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reg-stock',
  templateUrl: './reg-stock.component.html',
  styleUrls: ['./reg-stock.component.scss']
})
export class RegStockComponent implements OnInit {

  public availableFoods : IFood[];
  public foodByCat = new Map<string, IFood[]>;
  public selectedByCat = new Map<string, SelectedFood[]>;

  public currentlyDragging : IFood | null;

  constructor(private readonly regStockSer : StockService,
              private readonly spinnerService : NgxSpinnerService,
              private readonly messageService : MessageService,
              private readonly confirmationSer : ConfirmationService,
              private readonly router : Router,
  ) { }

  ngOnInit(): void {
    this.populate();
  }

  populate(){
    this.spinnerService.show();
    this.regStockSer.foodObservable$
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({next: value => {
        this.availableFoods = value;
        for (let iFood of value) {
            const catName = iFood.category;
          const iFoods = this.foodByCat.get(catName);
          if(iFoods != null){
              iFoods.push(iFood);
            }else{
              this.foodByCat.set(catName, [iFood]);
              this.selectedByCat.set(catName, []);
            }
        }
      },
      error: err => {

      },
      complete: () => {

      }
    })
  }


  dragStart(food: IFood) {
    this.currentlyDragging = food;
  }

  dragEnd() {
    this.currentlyDragging = null;
  }

  onDrop() {
    if(this.currentlyDragging == null)
      return;

    this.clickSelected(this.currentlyDragging);
  }

  clickSelected(food: IFood) {
    this.setSelected(food);
  }

  clickRemove(food : SelectedFood){
    this.removeSelected(food);
  }

  private removeSelected(selectedFood : SelectedFood){
    this.removeFromSecond(selectedFood);

    var findIndex = this.availableFoods.findIndex(f => selectedFood.foodId == f.foodId);
    if(findIndex < 0)
      return;

    const food = this.availableFoods[findIndex];
    var iFoodsCat = this.foodByCat.get(food.category);
    if(iFoodsCat == null){
      this.foodByCat.set(food.category, [food]);
    }else{
      iFoodsCat.push(food);
    }
  }

  //Drop to selected list
  private setSelected(food : IFood){
    const quantity = 20;
    const catName = food.category;

    this.removeFromFirst(food);

    const categoryList = this.selectedByCat.get(catName);
    const quantitySelectedFood = new SelectedFood(food);
    quantitySelectedFood.quantity = quantity;
    if(categoryList == null){
      this.selectedByCat.set(catName, [quantitySelectedFood]);
    }else{
      categoryList.push(quantitySelectedFood);
    }
  }

  //Remove from the collection of first div
  private removeFromFirst(food : IFood){
    var iFoods = this.foodByCat.get(food.category);
    if(iFoods == null)
      return;

    var findIndex = iFoods.findIndex(sF => sF.foodId == food.foodId);
    if(findIndex < 0)
      return;

    iFoods.splice(findIndex, 1);
  }

  //Remove from the collection of second div
  private removeFromSecond(food : SelectedFood){
    var iFoods = this.selectedByCat.get(food.category);
    if(iFoods == null)
      return;

    var findIndex = iFoods.findIndex(sF => sF.foodId == food.foodId);
    if(findIndex < 0)
      return;

    iFoods.splice(findIndex, 1);
  }

  submit(){
    const result : SelectedFood[] = [];
    for (let value of this.selectedByCat.values()) {
      for (let selectedFood of value) {
        result.push(selectedFood);
      }
    }

    this.spinnerService.show();
    this.regStockSer.registerStock(result)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          this.messageService.add({severity: "success", detail: "Successfully Registered!", summary: "Complete"});
          this.removeAll();
          this.router.navigate(['/staff/daily-stock'])
        },
        error: err => {
          let errorMsg = "Failed to register products!"
          if(err instanceof HttpErrorResponse){
            if(err.status === 422 && err.error){
              errorMsg = "Failed to register these "+err.error+"."
            }
          }
          console.log(err);
          this.messageService.add({severity: "error", detail: errorMsg, summary: "Failed"});
          this.removeAll();
        },
        complete: () => {

        }
      })
  }

  hasAnySelectedFood() : boolean {
    let foundOne = false;
    for (let value of this.selectedByCat.values()) {
      for (let selectedFood of value) {
        foundOne = true;
        break;
      }

      if(foundOne)
        break;
    }

    return foundOne;
  }

  removeAll() {
    const toRemove : SelectedFood[] = [];
    for (let value of this.selectedByCat.values()) {
      for (let selectedFood of value) {
        toRemove.push(selectedFood);
      }
    }

    for (let selectedFood of toRemove) {
      this.removeSelected(selectedFood);
    }
  }

  onReset(){
    this.confirmationSer.confirm({
      message: "Are you sure want to reset the entire stock list?",
      accept: () => {
        this.removeAll();
      }
    })
  }
}
