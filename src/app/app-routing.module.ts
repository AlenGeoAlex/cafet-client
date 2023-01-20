import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {Error404Component} from "./error404/error404.component";
import {AuthorizationGuard} from "./auth/authorization.guard";
import {ShopComponent} from "./shop/shop.component";

const routes: Routes = [
  {path: "", component: AppComponent},
  {path: "admin", loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule), data: { "ROLE" : "ADMIN"} , canActivate: [AuthorizationGuard]},
  {path: "404", component: Error404Component},
  {path: "auth", loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule)},
  {path: "staff", loadChildren: () => import('./cafet-staff/cafet-staff.module').then(mod => mod.CafetStaffModule), data: {"ROLE": "STAFF"}, canActivate: [AuthorizationGuard]},
  {path: "user", loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)},
  {path: "shop", loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path: '**', redirectTo: '404', pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
