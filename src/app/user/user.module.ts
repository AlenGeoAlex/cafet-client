import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserProfileComponent} from "./user-profile.component";
import { UserOverlayComponent } from './user-overlay/user-overlay.component';
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import { CartComponent } from './cart/cart/cart.component';
import {BadgeModule} from "primeng/badge";
import { CartProductComponent } from './cart/cart-product/cart-product.component';
import {DividerModule} from "primeng/divider";
import {InputNumberModule} from "primeng/inputnumber";
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { WalletRechargeComponent } from './wallet-recharge/wallet-recharge.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputTextModule} from "primeng/inputtext";
import {SharedModule} from "../pipes/shared-pipes/shared.module";
import { WalletHistoryComponent } from './wallet-history/wallet-history.component';
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import { MyOrdersComponent } from './my-orders/my-orders.component';
import {AccordionModule} from "primeng/accordion";


@NgModule({
  declarations: [
    UserProfileComponent,
    UserOverlayComponent,
    CartComponent,
    CartProductComponent,
    OrderPlacedComponent,
    WalletRechargeComponent,
    WalletHistoryComponent,
    MyOrdersComponent,
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        AvatarModule,
        MenuModule,
        ReactiveFormsModule,
        FormsModule,
        BadgeModule,
        DividerModule,
        InputNumberModule,
        AutoCompleteModule,
        InputTextModule,
        SharedModule,
        DropdownModule,
        CalendarModule,
        CheckboxModule,
        TableModule,
        AccordionModule,
    ]
})
export class UserModule { }
