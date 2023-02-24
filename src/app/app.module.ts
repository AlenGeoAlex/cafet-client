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
import {ErrorInterceptor} from "./interceptor/error.interceptor";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { BooleanPipe } from './pipes/boolean.pipe';
import { HomeComponent } from './home.component';
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "./pipes/shared-pipes/shared.module";
import {MenuModule} from "primeng/menu";
import { NullablePipe } from './pipes/nullable.pipe';
import {GoogleLoginProvider, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";

@NgModule({
    declarations: [
        AppComponent,
        Error404Component,
        HomeComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FileUploadModule,
    AdminModule,
    SharedModule,
    MenuModule,
  ],
    providers: [
      MessageService,
      ConfirmationService,
      {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                '',
                {
                  oneTapEnabled: false
                }
              )
            }
          ]
        } as SocialAuthServiceConfig,
      },
        // {provide: APP_INITIALIZER, useFactory: initializeApp, multi: true, deps: [AuthenticationService]},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
