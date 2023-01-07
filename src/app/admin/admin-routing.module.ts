import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminHomeComponent} from "./admin-home.component";
import {CategoryComponent} from "./category/category.component";
import {FoodComponent} from "./food/food.component";
import {UsersComponent} from "./user/user.component";

const routes: Routes = [
  {path: "", component: AdminHomeComponent},
  {path: "admin/category", component: CategoryComponent},
  {path: "admin/food", component: FoodComponent},
  {path: "admin/users", component: UsersComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
