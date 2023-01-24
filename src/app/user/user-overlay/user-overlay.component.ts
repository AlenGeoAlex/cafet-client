import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICart} from "../../domain/ICart";
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../services/authentication.service";
import {UserConstants} from "../../constants/UserConstants";
import {Menu} from "primeng/menu";
import {IWalletHistory} from "../../domain/IWalletHistory";

@Component({
  selector: 'app-user-overlay',
  templateUrl: './user-overlay.component.html',
  styleUrls: ['./user-overlay.component.scss']
})
export class UserOverlayComponent implements OnInit {
  @Input("cart") cart : ICart;
  @Output() onSearch = new EventEmitter();

  items : MenuItem[];
  userName : string;
  imageLink : string | null;


  constructor(private readonly authService : AuthenticationService) {


    let name = this.authService.getUserData(UserConstants.UserName);
    let imgLink = this.authService.getUserData(UserConstants.ImageLink);
    if(imgLink == null)
      this.imageLink = "";
    else this.imageLink = imgLink;
    if(name == null)
      this.userName = "Unknown";
    else this.userName = name;
    this.items = [
      {
        label: this.userName,
        items: [
          {
            label: "Profile",
            icon: "pi pi-user-edit",
            routerLink: "/user"
          },
          {
            label: "Cart",
            icon: "pi pi-shopping-cart",
            routerLink: "/user/cart"
          }
        ]
      },

      {
        label: "Order",
        items: [
          {
            label: "My Orders",
            icon: "pi pi-paperclip",
            routerLink: ""
          },
          {
            label: "Order History",
            icon: "pi pi-list",
            routerLink: ""
          }
        ]
      },

      {
        label: "Wallet",
        items: [
          {
            label: "Recharge Wallet",
            icon: "pi pi-credit-card",
            routerLink: "/user/wallet-recharge"
          },
          {
            label: "Wallet History",
            icon: "pi pi-database",
            routerLink: "/user/wallet-history"
          }
        ]
      },

      {
        label: "Account",
        items: [{
          label: "Logout",
          icon: "pi pi-lock",
          command: event => {
            this.authService.logout();
          }
        }]
      }


    ]
  }

  ngOnInit(): void {
  }

  searchEvent(inputElement: HTMLInputElement) {
    const searchElement = inputElement.value;

    if(searchElement.length <= 0)
    {
      this.onSearch.emit(null);
      return;
    }

    if(searchElement.length <= 3)
      return

    this.onSearch.emit(searchElement);
  }

  openItem(av: Menu, $event: MouseEvent) {
    console.log(123)
    av.toggle($event)
  }
}
