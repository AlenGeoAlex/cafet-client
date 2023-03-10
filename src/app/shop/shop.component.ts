import {Component, OnDestroy, OnInit} from '@angular/core';
import {CafetService} from "../services/cafet.service";
import {IDailyStock, IShopStock} from "../domain/IDailyStock";
import {StockService} from "../services/stock.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {BehaviorSubject, finalize, Subscription} from "rxjs";
import {UserConstants} from "../constants/UserConstants";
import {CartService} from "../services/cart.service";
import {ICart, ICartData} from "../domain/ICart";
import {AuthenticationService} from "../services/authentication.service";
import {StatisticsService} from "../services/statistics.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  public ignoreOutOfStock : boolean;
  public allowedFoodType : string;

  public stock : IShopStock[];
  public stockMap = new Map<string, IShopStock[]>;

  public readonly cartSubject : Subscription;
  public cart : ICart | null;

  public cartMap = new Map<string, ICartData[]>;

  public imageLink : string | null;

  public readonly FoodType : FoodTypeDropDown[] = [
    {typeIdentifier: "All", typeCode: "A"},
    {typeIdentifier: "Non-Vegetarian", typeCode: "N"},
    {typeIdentifier: "Vegetarian", typeCode: "V"}
  ]

  public topSellerFoodId : number[];

  constructor(
    private readonly cafetService : CafetService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly messageService : MessageService,
    private readonly stockService : StockService,
    private readonly cartService : CartService,
    private readonly authService : AuthenticationService,
    private readonly statsService : StatisticsService,
  ) {
    this.stock = [];
    this.topSellerFoodId = [];
    this.getTopSeller();

    this.imageLink = this.authService.getUserData(UserConstants.ImageLink);

/*    const tempCart  = this.cartService.getCart();
    if(tempCart != null)
      this.cart = tempCart;*/

    var filterSettings = localStorage.getItem(UserConstants.FilterConstants);
    this.cartService.updateCart();
    this.cartSubject = cartService.cartCacheSubject$.asObservable().subscribe({
      next: value => {
        if(value == null)
          return;

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
        this.cart = null;
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

  getTopSeller(){
    this.statsService.getTopSeller()
      .subscribe({
        next: value => {
          for (let itTopSoldFood of value) {
            this.topSellerFoodId.push(itTopSoldFood.foodId);
          }

        }
      })
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

  applyFilter(dailyStock : IShopStock[]) : IShopStock[] {
    if(this.ignoreOutOfStock)
      dailyStock = dailyStock.filter(d => d.currentInStock > 0);

    if(this.allowedFoodType === "V")
      dailyStock = dailyStock.filter(d => d.foodType)
    else if(this.allowedFoodType === "N")
      dailyStock = dailyStock.filter(d => !d.foodType)

    this.mapStock(dailyStock);
    return dailyStock;
  }

  private mapStock(ds : IShopStock[]){
    this.stockMap.clear();
    for (let eachStock of ds) {
      const category = eachStock.foodCategory;

      //Map as topSeller
      if(this.topSellerFoodId.findIndex(s => s == eachStock.foodId) >= 0)
        eachStock.topSeller = true;

      //Map to Category
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
