import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICart, ICartData} from "../../../domain/ICart";
import {CartService} from "../../../services/cart.service";
import {ICartAddition} from "../../../domain/Params/OutputDto";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {

  @Input() Cart : ICartData;
  @Output() onItemRemove = new EventEmitter();
  private cartQuantity : number;
  constructor(private readonly cartService : CartService, private readonly spinnerService : NgxSpinnerService, private readonly messageService : MessageService) { }

  ngOnInit(): void {
    this.cartQuantity = this.Cart.quantity;
  }

  removeItem(){
    this.spinnerService.show();
    this.cartService.removeItemFromCart(this.Cart.foodId)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          this.onItemRemove.next(this.Cart);
          this.messageService.add({severity: "success", summary: "Updated", detail:`${this.Cart.foodName} has been removed`})
        },
        error: err => {
          if(err instanceof HttpErrorResponse && err.status == 400){
            if(err.error){
              this.messageService.add({severity: "error", summary: "Failed", detail: err.error})
              return;
            }
          }
          this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to remove the item!"})
        },
        complete: () => {

        }
      })
  }

  changeQuantity(increase : boolean){
    if(!increase){
      if(this.cartQuantity <= 1){
        this.removeItem();
        return;
      }
    }

    const cartAddition : ICartAddition = {
      foodId: this.Cart.foodId,
      quantity: (increase ? this.cartQuantity+1 : this.cartQuantity-1)
    }

    this.spinnerService.show();
    this.cartService.addToCart(cartAddition)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {

            this.Cart.quantity = (increase ? this.cartQuantity+1 : this.cartQuantity-1);
            this.cartQuantity = (increase ? this.cartQuantity+1 : this.cartQuantity-1);
            this.messageService.add({severity: "success", summary: "Updated", detail:`${this.Cart.foodName} has been increased to ${this.cartQuantity}`})
        },
        error: err => {
          if(err instanceof HttpErrorResponse && err.status == 400){
            if(err.error){
              this.messageService.add({severity: "error", summary: "Failed", detail: err.error})
              return;
            }
          }

          this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to update the cart quantity!"})
        },
        complete: () => {

        }
      })
  }

  getClassForVeg(isVeg : boolean) : string {
    if(isVeg)
      return "status-veg"
    else return "status-non-veg";
  }

}
