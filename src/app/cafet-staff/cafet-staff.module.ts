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

@NgModule({
  declarations: [
    StaffComponent,
    StaffNavbarComponent,
    RegStockComponent,
    DailyStockComponent,

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
  ]
})
export class CafetStaffModule { }
