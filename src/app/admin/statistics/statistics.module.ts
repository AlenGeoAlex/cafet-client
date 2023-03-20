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
import { UserActivityStatsComponent } from './user-activity-stats/user-activity-stats.component';
import {TimelineModule} from "primeng/timeline";
import {CardModule} from "primeng/card";
import { OrderStatsComponent } from './order-stats/order-stats.component';
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import { RevenuveStatsComponent } from './revenuve-stats/revenuve-stats.component';


@NgModule({
  declarations: [
    TotalOrderComponent,
    UserActivityStatsComponent,
    OrderStatsComponent,
    RevenuveStatsComponent
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
    RippleModule,
    TimelineModule,
    CardModule,
    TableModule,
    TooltipModule
  ]
})
export class StatisticsModule { }
