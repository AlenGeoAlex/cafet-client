import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth.component";
import {ResetPassComponent} from "./reset-pass/reset-pass.component";

const routes: Routes = [
  {path: "", component: AuthComponent},
  {path: "reset", component: ResetPassComponent},
  {path: "reset/:email", component: ResetPassComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
