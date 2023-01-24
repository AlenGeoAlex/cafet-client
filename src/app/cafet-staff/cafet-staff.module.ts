import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CafetStaffRoutingModule } from './cafet-staff-routing.module';
import {StaffComponent} from "./staff.component";
import {ButtonModule} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {StaffNavbarComponent} from "./staff-navbar/staff-navbar.component";
import { RegStockComponent } from './reg-stock/reg-stock.component';
import {TableModule} from "primeng/table";
import {TabViewModule} from "primeng/tabview";
import {DragDropModule} from "primeng/dragdrop";
import {RippleModule} from "primeng/ripple";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import { DailyStockComponent } from './daily-stock/daily-stock.component';
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {AutoCompleteModule} from "primeng/autocomplete";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DialogModule} from "primeng/dialog";
import { RechargeCusComponent } from './recharge-cus/recharge-cus.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import {AppModule} from "../app.module";
import {BooleanPipe} from "../pipes/boolean.pipe";
import {SharedModule} from "../pipes/shared-pipes/shared.module";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
  declarations: [
    StaffComponent,
    StaffNavbarComponent,
    RegStockComponent,
    DailyStockComponent,
    RechargeCusComponent,
    OrderDetailComponent,
  ],

  imports: [
    CommonModule,
    CafetStaffRoutingModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TableModule,
    TabViewModule,
    DragDropModule,
    RippleModule,
    InputNumberModule,
    FormsModule,
    DividerModule,
    InputTextModule,
    CardModule,
    AutoCompleteModule,
    OverlayPanelModule,
    DialogModule,
    SharedModule,
    CheckboxModule,
  ]
})
export class CafetStaffModule { }
