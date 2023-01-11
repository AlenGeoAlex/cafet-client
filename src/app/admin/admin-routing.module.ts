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
  {path: "", component: AdminHomeComponent},
  {path: "admin/category", component: CategoryComponent, canActivate: [AuthorizationGuard]},
  {path: "admin/food", component: FoodComponent, canActivate: [AuthorizationGuard]},
  {path: "admin/food/edit/:id", component: FoodEditComponent, canActivate: [AuthorizationGuard]},
  {path: "admin/users", component: UsersComponent, canActivate: [AuthorizationGuard]},
  {path: "admin/users/reg", component: UserRegComponent, canActivate: [AuthorizationGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
