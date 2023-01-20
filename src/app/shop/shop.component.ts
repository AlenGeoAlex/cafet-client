import { Component, OnInit } from '@angular/core';
import {CafetService} from "../services/cafet.service";
import {IDailyStock} from "../domain/IDailyStock";
import {StockService} from "../services/stock.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MenuItem, MessageService} from "primeng/api";
import {finalize} from "rxjs";
import {UserConstants} from "../constants/UserConstants";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  public ignoreOutOfStock : boolean;
  public allowedFoodType : string;

  public stock : IDailyStock[];
  public stockMap = new Map<string, IDailyStock[]>;


  public readonly FoodType : FoodTypeDropDown[] = [
    {typeIdentifier: "All", typeCode: "A"},
    {typeIdentifier: "Non-Vegetarian", typeCode: "N"},
    {typeIdentifier: "Vegetarian", typeCode: "V"}
  ]

  constructor(
    private readonly cafetService : CafetService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly messageService : MessageService,
    private readonly stockService : StockService,
  ) {
    this.stock = [];
    var filterSettings = localStorage.getItem(UserConstants.FilterConstants);
    if(filterSettings == null){
      this.ignoreOutOfStock = true;
      this.allowedFoodType = 'A';
      this.createAndSetFilterCache();
    }else{
      const settings : FilterSetting = JSON.parse(filterSettings);
      this.ignoreOutOfStock = settings.ignoreFoodOnStock;
      this.allowedFoodType = settings.foodTypeCode;
    }
  }

  loadFoodInStock() {
    this.spinnerService.show();
    this.stockService.stockObservable$
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
      next: value => {
        this.stock = this.applyFilter(value);
      },
      error: err => {

      },
      complete : () => {

      }
    })
  }

  loadFoodBySearch(searchQuery : string) {
    this.spinnerService.show();
    this.cafetService.searchStockFood(searchQuery)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          this.stock = this.applyFilter(value);
        },
        error: err => {

        },
        complete : () => {

        }
      })
  }

  onSearch($event : string  | null){
    if($event == null)
      this.loadFoodInStock();
    else{
      this.loadFoodBySearch($event);
    }
  }

  applyFilter(dailyStock : IDailyStock[]) : IDailyStock[] {
    if(this.ignoreOutOfStock)
      dailyStock = dailyStock.filter(d => d.currentInStock > 0);

    if(this.allowedFoodType === "V")
      dailyStock = dailyStock.filter(d => d.foodType)
    else if(this.allowedFoodType === "N")
      dailyStock = dailyStock.filter(d => !d.foodType)

    this.mapStock(dailyStock);
    return dailyStock;
  }

  private mapStock(ds : IDailyStock[]){
    this.stockMap.clear();
    for (let eachStock of ds) {
      const category = eachStock.foodCategory;

      const stockOfCategory = this.stockMap.get(category);
      if(stockOfCategory == null){
        this.stockMap.set(category, [eachStock])
      }else{
        stockOfCategory.push(eachStock);
      }
    }
  }

  ngOnInit(): void {
    this.loadFoodInStock();
  }

  setOnIgnoreStock() {
    this.loadFoodInStock()
    this.createAndSetFilterCache();
  }

  private createAndSetFilterCache(){
    const x : FilterSetting = {
      ignoreFoodOnStock: this.ignoreOutOfStock,
      foodTypeCode: this.allowedFoodType
    }
    localStorage.removeItem(UserConstants.FilterConstants);
    localStorage.setItem(UserConstants.FilterConstants, JSON.stringify(x))
  }

  onFoodTypeSet() {
    this.loadFoodInStock()
    this.createAndSetFilterCache();
  }
}

interface FoodTypeDropDown {
  typeIdentifier: string,
  typeCode : string,
}

interface FilterSetting {
  ignoreFoodOnStock : boolean;
  foodTypeCode : string;
}
