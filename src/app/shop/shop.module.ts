import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopOverlayComponent } from './shop-overlay/shop-overlay.component';
import { ShopComponent } from './shop.component';
import { ShopCardComponent } from './shop-card/shop-card.component';
import { CategoryComponent } from './category/category.component';
import {AccordionModule} from "primeng/accordion";
import {DividerModule} from "primeng/divider";
import {BadgeModule} from "primeng/badge";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DialogModule} from "primeng/dialog";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";


@NgModule({
  declarations: [
    ShopOverlayComponent,
    ShopComponent,
    ShopCardComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    AccordionModule,
    DividerModule,
    BadgeModule,
    CheckboxModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    OverlayPanelModule,
    DialogModule,
    BreadcrumbModule,
    AvatarModule,
    MenuModule
  ]
})
export class ShopModule { }
