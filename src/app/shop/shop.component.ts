import {Component, OnDestroy, OnInit} from '@angular/core';
import {CafetService} from "../services/cafet.service";
import {IDailyStock} from "../domain/IDailyStock";
import {StockService} from "../services/stock.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {BehaviorSubject, finalize} from "rxjs";
import {UserConstants} from "../constants/UserConstants";
import {CartService} from "../services/cart.service";
import {ICart, ICartData} from "../domain/ICart";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  public ignoreOutOfStock : boolean;
  public allowedFoodType : string;

  public stock : IDailyStock[];
  public stockMap = new Map<string, IDailyStock[]>;

  public readonly cartSubject : BehaviorSubject<ICart | null>;
  public cart : ICart;

  public cartMap = new Map<string, ICartData[]>;

  public imageLink : string | null;

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
    private readonly cartService : CartService,
    private readonly authService : AuthenticationService,
  ) {
    this.stock = [];
    this.imageLink = this.authService.getUserData(UserConstants.ImageLink);

    const tempCart  = this.cartService.getCart();
    if(tempCart != null)
      this.cart = tempCart;

    this.cartSubject = cartService.cartCacheSubject$;
    var filterSettings = localStorage.getItem(UserConstants.FilterConstants);
    this.cartService.updateCart();
    this.cartSubject.subscribe({
      next: value => {
        if(value == null)
          return;

        console.log(value);
        this.cart = value;

        for (let cartDatum of value.cartData) {
          const cartData = this.cartMap.get(cartDatum.foodCategory);

          if(cartData == null){
            this.cartMap.set(cartDatum.foodCategory, [cartDatum]);
          }else{
            cartData.push(cartDatum);
          }
        }

      },
      error: err => {

      },
      complete: () => {

      }
    });

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

  getCategoryMappedStock(cat : string) : ICartData[] | undefined {
    return this.cartMap.get(cat);
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

  ngOnDestroy(): void {
    this.cartSubject.unsubscribe();
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
