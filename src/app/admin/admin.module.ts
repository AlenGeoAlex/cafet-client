  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { OverlayComponent } from './overlay/overlay.component';
import {AvatarModule} from 'primeng/avatar';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {RouterModule} from "@angular/router";
import { CategoryComponent } from './category/category.component';
import { FoodComponent } from './food/food.component';
import { UsersComponent } from './user/user.component';
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import { CatViewComponent } from './category/cat-view/cat-view.component';
import { CatRegComponent } from './category/cat-reg/cat-reg.component';
import {InputTextareaModule} from "primeng/inputtextarea";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { FoodRegComponent } from './food/food-reg/food-reg.component';
import {FileUploadModule} from "primeng/fileupload";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputNumberModule} from "primeng/inputnumber";
import { FoodViewComponent } from './food/food-view/food-view.component';
import { FoodEditComponent } from './food/food-edit/food-edit.component';
import {ImageModule} from "primeng/image";
import { UserRegComponent } from './user/user-reg/user-reg.component';
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {BadgeModule} from "primeng/badge";
  import {RadioButtonModule} from "primeng/radiobutton";
  import {ChipsModule} from "primeng/chips";

@NgModule({
    declarations: [
        AdminHomeComponent,
        OverlayComponent,
        CategoryComponent,
        FoodComponent,
        UsersComponent,
        CatViewComponent,
        CatRegComponent,
        FoodRegComponent,
        FoodViewComponent,
        FoodEditComponent,
        UserRegComponent
    ],
    exports: [
        CategoryComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AvatarModule,
        MenuModule,
        RouterModule,
        CardModule,
        DividerModule,
        ButtonModule,
        TableModule,
        RippleModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
        ToastModule,
        ConfirmDialogModule,
        FileUploadModule,
        AutoCompleteModule,
        InputNumberModule,
        ImageModule,
        DropdownModule,
        MultiSelectModule,
        BadgeModule,
        RadioButtonModule,
        ChipsModule,
    ]
})
export class AdminModule { }
