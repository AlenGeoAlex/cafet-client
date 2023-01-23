import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BooleanPipe} from "../boolean.pipe";



@NgModule({
  declarations: [
    BooleanPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BooleanPipe
  ]
})
export class SharedPipesModule { }
