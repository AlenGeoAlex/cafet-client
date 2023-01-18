import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminHomeComponent} from "./admin-home.component";
import {CategoryComponent} from "./category/category.component";
import {FoodComponent} from "./food/food.component";
import {UsersComponent} from "./user/user.component";
import {FoodEditComponent} from "./food/food-edit/food-edit.component";
import {AuthorizationGuard} from "../auth/authorization.guard";
import {UserRegComponent} from "./user/user-reg/user-reg.component";

const routes: Routes = [
  {path: "", component: AdminHomeComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "category", component: CategoryComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "food", component: FoodComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "food/edit/:id", component: FoodEditComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "users", component: UsersComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "users/reg", component: UserRegComponent, data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
