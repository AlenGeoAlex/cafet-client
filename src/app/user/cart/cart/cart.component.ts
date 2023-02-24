import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {ICart, ICartData} from "../../../domain/ICart";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {BehaviorSubject, finalize, Subscription} from "rxjs";
import {IUser} from "../../../domain/IUser";
import {AuthenticationService} from "../../../services/authentication.service";
import {UserService} from "../../../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Order} from "../../../domain/Order";
import {FoodOrder} from "../../../domain/StaffFoodOrder";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cart : ICart;
  user : IUser;
  private readonly cartSubject : Subscription;
  constructor(
    private readonly cartService : CartService,
    private readonly userService : UserService,
    private readonly router : Router,
    private readonly authService : AuthenticationService,
    private readonly messageService : MessageService,
    private readonly spinnerService : NgxSpinnerService,
  ) {
    this.cartService.cartObservable$.subscribe({
      next: value => {
        if(value == null){
          this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to fetch your cart!"});
          return;
        }


        this.cart = value;
      },
      error: err => {
        console.log(err)
        this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to fetch your cart!"});
        return;
      }
    })

    this.cartSubject = this.cartService.cartCacheSubject$.asObservable().subscribe({
      next: value => {
        if(value == null){
          return;
        }

        this.cart = value;
      },
      error: err => {
        //this.router.navigate(['/404']);
        console.log(err)
        this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to fetch your cart!"});
        return;
      }
    })

    this.userService.meObservable$.subscribe({
      next: value => {
        this.user = value;
        console.log(this.user)
      },
      error: err => {
        console.log(err)
        if(err instanceof HttpErrorResponse){
          if(err.status == 403){
            this.authService.logout();
            this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Please relogin again!"});
          }
        }
      },
      })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.cartSubject.unsubscribe();
  }

  getTotalNoOfItems() : number {
    let count = 0;

    for (let cartDatum of this.cart.cartData) {
      count += cartDatum.quantity
    }

    return count;
  }

  getTotalPrice(): number {
    let count = 0;

    for (let cartDatum of this.cart.cartData) {
      count += cartDatum.quantity * cartDatum.foodPrice
    }

    return count;
  }



  removeItem($event: ICartData) {
    const index = this.cart.cartData.findIndex(x => x.foodId == $event.foodId);

    if(index <= -1)
      return;

    this.cart.cartData.splice(index, 1);
    this.cartService.updateCart();
  }

  order(b: boolean) {
    const foodItems : Order[] = [];
    for (let cartDatum of this.cart.cartData) {
      const order = new Order(cartDatum);
      order.orderQuantity = cartDatum.quantity
      foodItems.push(order)
    }

    const foodOrder : FoodOrder = new FoodOrder(foodItems, b);
    this.spinnerService.show();
    this.userService.order(foodOrder)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          console.log(value)


          return;

          if(value.orderSuccessful){
            this.messageService.add({severity: "success", summary: "Order Placed", detail: "Successfully placed the order"})
            this.messageService.add({severity: "success", summary: "Order Id", detail: value.orderId})
            this.router.navigate(['/user/order-placed/'+value.orderId])
          }else{
            this.messageService.add({severity: "error", summary: "Order Failed!", detail: "Failed to order!"})
          }
        },
        error: err => {
          if(err instanceof HttpErrorResponse) {
            if(err.error){
              this.messageService.add({severity: "error", summary: "Order Failed!", detail: err.error})
            }else{
              this.messageService.add({severity: "error", summary: "Order Failed!", detail: "An unknown error occurred!"})
            }
          }else{
            this.messageService.add({severity: "error", summary: "Order Failed!", detail: "An unknown error occurred!"})
          }
          console.log(err);
        },
        complete: () => {

        }
      })
  }
}
