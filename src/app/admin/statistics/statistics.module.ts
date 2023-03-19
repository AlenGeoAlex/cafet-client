import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { TotalOrderComponent } from './total-order/total-order.component';
import {AdminModule} from "../admin.module";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ChartModule} from "primeng/chart";
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    TotalOrderComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    AdminModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    ChartModule,
    RippleModule
  ]
})
export class StatisticsModule { }
