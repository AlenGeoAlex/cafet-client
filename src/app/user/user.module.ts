import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserProfileComponent} from "./user-profile.component";
import { UserOverlayComponent } from './user-overlay/user-overlay.component';
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    UserProfileComponent,
    UserOverlayComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AvatarModule,
    MenuModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    FormsModule
  ]
})
export class UserModule { }
