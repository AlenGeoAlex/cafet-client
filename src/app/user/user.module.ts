import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserProfileComponent} from "./user-profile.component";
import { UserOverlayComponent } from './user-overlay/user-overlay.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    UserOverlayComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
