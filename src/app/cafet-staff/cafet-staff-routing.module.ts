import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StaffComponent} from "./staff.component";
import {RegStockComponent} from "./reg-stock/reg-stock.component";
import {DailyStockComponent} from "./daily-stock/daily-stock.component";
import {AuthorizationGuard} from "../auth/authorization.guard";
import {RechargeCusComponent} from "./recharge-cus/recharge-cus.component";

const routes: Routes = [
  {path: "", component: StaffComponent, data: {"ROLE": "STAFF"}, canActivate: [AuthorizationGuard]},
  {path: "reg-stock", component: RegStockComponent, data: {"ROLE": "STAFF"}, canActivate: [AuthorizationGuard]},
  {path: "daily-stock", component: DailyStockComponent, data: {"ROLE": "STAFF"}, canActivate: [AuthorizationGuard]},
  {path: "recharge", component: RechargeCusComponent, data: {"ROLE": "STAFF"}, canActivate: [AuthorizationGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CafetStaffRoutingModule { }
