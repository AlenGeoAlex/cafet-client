import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TotalOrderComponent} from "./total-order/total-order.component";
import {AuthorizationGuard} from "../../auth/authorization.guard";

const routes: Routes = [
  {path: "total-orders", component: TotalOrderComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
