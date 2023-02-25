import { Component, OnInit } from '@angular/core';
import * as moment from "moment/moment";
import {HttpParams} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {IStaffOrderView, OrderedFood} from "../../domain/IStaffOrderView";
import {ActivatedRoute} from "@angular/router";
import {PaymentStatus} from "../../constants/PaymentStatus";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  public oneMonthBefore = moment(new Date()).subtract(1, 'month').toDate();
  public today = new Date();

  public fromSelectedDate = this.oneMonthBefore;
  public toSelectedDate = this.today;
  public allTime : boolean = false;
  public onlyActive : boolean = false;

  public orders : IStaffOrderView[] = [];

  public selectedRoute : string | null;

  constructor(
    private readonly userService : UserService,
    private readonly activatedRoute : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.selectedRoute = this.activatedRoute.snapshot.paramMap.get("oId");
    this.fetchOrderHistory();
  }

  fetchOrderHistory() {
    let para = new HttpParams();

    if(!this.allTime){
      para = para.append("from", this.fromSelectedDate.toISOString());
      para = para.append("to", this.toSelectedDate.toISOString());
    }

    para = para.append("onlyActive", this.onlyActive ? "true" : "false");

    this.userService.getOrders(para).subscribe({
      next: value => {
        this.orders = value;
      }
    })

  }

  getTotalPrice(of : OrderedFood[]) : number {
    let cost = 0;

    for (let orderedFood of of) {
      cost += orderedFood.foodQuantity * orderedFood.foodPrice;
    }

    return cost;
  }

  getOrderPriceClass(paymentStatus: number) : string {
    if(paymentStatus === PaymentStatus.Pending){
      return "text-warning";
    }else if(paymentStatus === PaymentStatus.Success){
      return "text-success";
    }else if(paymentStatus === PaymentStatus.Cancelled){
      return "text-danger";
    }

    return "text-info";
  }
}
