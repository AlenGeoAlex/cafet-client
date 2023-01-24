import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {UserConstants} from "./constants/UserConstants";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public readonly username : string | null;
  public readonly items : MenuItem[];
  constructor(
    private readonly authService : AuthenticationService
  ) {
    this.username = authService.getUserData(UserConstants.UserName);
    if(this.username != null){
      this.items = [
        {
          label: this.username,
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
              routerLink: "/user/orders"
            },
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
  }

  ngOnInit(): void {
  }

}
