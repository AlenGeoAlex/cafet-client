import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {RippleModule} from "primeng/ripple";
import {SocialLoginModule} from "@abacritt/angularx-social-login";


@NgModule({
  declarations: [
    AuthComponent,
    ResetPassComponent,
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        ToastModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
        TooltipModule,
        RippleModule,
        SocialLoginModule
    ]
})
export class AuthModule { }
