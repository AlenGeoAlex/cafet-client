import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BooleanPipe} from "../boolean.pipe";
import {ToastModule} from "primeng/toast";
import {NgxSpinnerModule} from "ngx-spinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {NullablePipe} from "../nullable.pipe";



@NgModule({
  declarations: [
    BooleanPipe,
    NullablePipe,

  ],
  imports: [
    CommonModule,
    ToastModule,
    NgxSpinnerModule,
    ConfirmDialogModule,
    RippleModule,
    ButtonModule,
  ],
  exports: [
    NullablePipe,
    BooleanPipe,
    ToastModule,
    NgxSpinnerModule,
    ConfirmDialogModule,
    RippleModule,
    ButtonModule,
  ]
})
export class SharedModule { }
