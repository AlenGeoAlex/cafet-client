import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StaffComponent} from "./staff.component";
import {RegStockComponent} from "./reg-stock/reg-stock.component";
import {DailyStockComponent} from "./daily-stock/daily-stock.component";

const routes: Routes = [
  {path: "", component: StaffComponent},
  {path: "reg-stock", component: RegStockComponent},
  {path: "daily-stock", component: DailyStockComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CafetStaffRoutingModule { }
