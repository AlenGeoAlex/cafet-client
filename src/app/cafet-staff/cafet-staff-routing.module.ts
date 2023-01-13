import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StaffComponent} from "./staff.component";
import {RegStockComponent} from "./reg-stock/reg-stock.component";

const routes: Routes = [
  {path: "", component: StaffComponent},
  {path: "reg-stock", component: RegStockComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CafetStaffRoutingModule { }
