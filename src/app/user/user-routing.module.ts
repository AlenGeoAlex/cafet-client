import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserProfileComponent} from "./user-profile.component";
import {AuthorizationGuard} from "../auth/authorization.guard";


const routes: Routes = [
  {path: "", component: UserProfileComponent, data: {"ROLE": ["CUSTOMER", "STAFF", "ADMIN"]}, canActivate: [AuthorizationGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
