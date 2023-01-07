import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [
  {path: "", component: AppComponent},
  {path: "admin", loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)},
  {path: '**', redirectTo: 'not-found', pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
