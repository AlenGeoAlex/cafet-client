import {Component, Input, OnInit} from '@angular/core';
import {IDailyStock} from "../../domain/IDailyStock";
import {OverlayPanel} from "primeng/overlaypanel";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.scss']
})
export class ShopCardComponent implements OnInit {

  @Input("stock") Stock : IDailyStock;

  tempCartQuantity : number;
  cartQuantity : number;
  cartButtonStyle : "p-button-info" | "p-button-success"

  constructor(private readonly messageService : MessageService) {
    this.tempCartQuantity = 1;
    this.cartQuantity = 0;
    this.cartButtonStyle = "p-button-info";
  }

  ngOnInit(): void {
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
    //op.el.nativeElement.scrollInView();
  }

  addToCart(op: OverlayPanel) {
    if(this.tempCartQuantity <= 0){
      this.cartQuantity = 0;
      this.cartButtonStyle = "p-button-info";
      op.hide();
      return;
    }

    if(this.tempCartQuantity > this.Stock.currentInStock){
      this.messageService.add({severity: "error", detail: `The quantity must be a valid number between 1 and ${this.Stock.currentInStock}!`, summary: "Failed"})
      return;
    }

    this.cartQuantity = this.tempCartQuantity;
    this.cartButtonStyle = "p-button-success";
    op.hide();
  }

  clearCart(op : OverlayPanel){
    this.tempCartQuantity = 0;
    this.addToCart(op);
  }

  getCartQuantityString() : string {
    if(this.cartQuantity <= 0)
      return "Add To Cart";
    else return `In Cart - (${this.cartQuantity})`
  }
}
