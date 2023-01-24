import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserProfileComponent} from "./user-profile.component";
import {AuthorizationGuard} from "../auth/authorization.guard";
import {CartComponent} from "./cart/cart/cart.component";
import {OrderPlacedComponent} from "./order-placed/order-placed.component";
import {WalletRechargeComponent} from "./wallet-recharge/wallet-recharge.component";
import {WalletHistoryComponent} from "./wallet-history/wallet-history.component";
import {MyOrdersComponent} from "./my-orders/my-orders.component";


const routes: Routes = [
  {path: "", component: UserProfileComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "cart", component: CartComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "order-placed/:id", component: OrderPlacedComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "wallet-recharge", component: WalletRechargeComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "wallet-history", component: WalletHistoryComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "orders", component: MyOrdersComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
  {path: "orders/:oId", component: MyOrdersComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
