import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FileUploadModule} from "primeng/fileupload";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AdminModule } from './admin/admin.module';
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import { Error404Component } from './error404/error404.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {JwtInterceptor} from "./interceptor/jwt.interceptor";
import {initializeApp} from "./helper/initializeApp";
import {AuthenticationService} from "./auth/authentication.service";
import {ErrorInterceptor} from "./interceptor/error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FileUploadModule,
    AdminModule,
    ToastModule,
    NgxSpinnerModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    // {provide: APP_INITIALIZER, useFactory: initializeApp, multi: true, deps: [AuthenticationService]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
