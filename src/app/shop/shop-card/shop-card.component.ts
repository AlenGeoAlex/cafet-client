import {Component, Input, OnInit} from '@angular/core';
import {IDailyStock, IShopStock} from "../../domain/IDailyStock";
import {OverlayPanel} from "primeng/overlaypanel";
import {MessageService} from "primeng/api";
import {ICartAddition} from "../../domain/Params/OutputDto";
import {NgxSpinnerService} from "ngx-spinner";
import {CartService} from "../../services/cart.service";
import {finalize} from "rxjs";
import {ICartData} from "../../domain/ICart";

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {

  @Input() Stock : IShopStock;
  @Input() Cart : ICartData | null;

  tempCartQuantity : number;
  cartQuantity : number;
  cartButtonStyle : "p-button-info" | "p-button-success"

  constructor(private readonly messageService : MessageService, private readonly spinnerService : NgxSpinnerService, private readonly cartService : CartService) {
    this.tempCartQuantity = 1;
    this.cartQuantity = 0;


    this.cartButtonStyle = "p-button-info";
  }

  ngOnInit(): void {

    if(this.Cart != null){
      this.cartQuantity = this.Cart.quantity;
      this.tempCartQuantity = this.cartQuantity;
      this.cartButtonStyle = "p-button-success";
    }
  }

  getCssBadgeOfFoodType() : string {
    if(this.Stock.foodType)
      return "status-veg";
    else return "status-non-veg"
  }


  openStockCart(op: OverlayPanel, $event: MouseEvent, addToStock: HTMLButtonElement) {
    if(this.cartQuantity > 0){
      this.tempCartQuantity = this.cartQuantity;
    }else{
      this.tempCartQuantity = 1;
    }
    op.toggle($event, addToStock);
  }

  addToCart(op: OverlayPanel) {
    if(this.tempCartQuantity <= 0){
      op.hide();

      this.spinnerService.show();
      this.cartService.removeItemFromCart(this.Stock.foodId)
        .pipe(finalize(() => {
          this.cartService.updateCart();
          this.spinnerService.hide();
        }))
        .subscribe({
          next: value => {
            this.cartQuantity = 0;
            this.cartButtonStyle = "p-button-info";
            this.messageService.add({severity: "success", summary: "Added!", detail: "Updated Cart!"})
          },
          error: err => {
            this.messageService.add({severity: "error", summary: "Failed!", detail: "Failed to remove item from the cart!"})
            console.log(err);
          },
          complete: () => {

          }
        })
      return;
    }

    if(this.tempCartQuantity > this.Stock.currentInStock){
      this.messageService.add({severity: "error", detail: `The quantity must be a valid number between 1 and ${this.Stock.currentInStock}!`, summary: "Failed"})
      return;
    }

    this.cartQuantity = this.tempCartQuantity;
    this.cartButtonStyle = "p-button-success";
    op.hide();

    const toCart : ICartAddition = {
      foodId: this.Stock.foodId,
      quantity: this.cartQuantity,
    }

    this.spinnerService.show();
    this.cartService.addToCart(toCart)
      .pipe(finalize(() => {
        this.cartService.updateCart();
        this.spinnerService.hide();
      }))
      .subscribe({
        next: val => {
          this.messageService.add({severity: "success", summary: "Added!", detail: "Updated Cart!"})
        },

        error: err => {
          this.messageService.add({severity: "error", detail: "Failed to add the item as the item is not in stock anymore", summary: "Not in stock!"})
          console.log(err);
        },

        complete: () => {

        }
      })
  }

  clearItem(op : OverlayPanel){
    this.tempCartQuantity = 0;
    this.addToCart(op);
  }

  getCartQuantityString() : string {
    if(this.cartQuantity <= 0)
      return "Add To Cart";
    else return `In Cart - (${this.cartQuantity})`
  }
}
