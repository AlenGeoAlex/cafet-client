import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TotalOrderComponent} from "./total-order/total-order.component";
import {AuthorizationGuard} from "../../auth/authorization.guard";
import {UserActivityStatsComponent} from "./user-activity-stats/user-activity-stats.component";
import {OrderStatsComponent} from "./order-stats/order-stats.component";
import {RevenuveStatsComponent} from "./revenuve-stats/revenuve-stats.component";

const routes: Routes = [
  {path: "total-orders", component: TotalOrderComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "revenue-stats", component: RevenuveStatsComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "user-activity-stats/:userId", component: UserActivityStatsComponent, data: {"ROLE" : "ADMIN"}, canActivate: [AuthorizationGuard]},
  {path: "order-stats/:orderId", component: OrderStatsComponent, data: {"ROLE" : "ADMIN"}, canActivate: [AuthorizationGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
