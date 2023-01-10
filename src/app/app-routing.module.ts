import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {Error404Component} from "./error404/error404.component";
import {AuthorizationGuard} from "./auth/authorization.guard";

const routes: Routes = [
  {path: "", component: AppComponent},
  {path: "admin", loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule), data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "404", component: Error404Component},
  {path: "auth", loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule)},
  {path: '**', redirectTo: 'not-found', pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
