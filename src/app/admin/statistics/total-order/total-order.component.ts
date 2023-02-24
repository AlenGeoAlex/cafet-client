import { Component, OnInit } from '@angular/core';
import * as moment from "moment/moment";
import {StatisticsService} from "../../../services/statistics.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-total-order',
  templateUrl: './total-order.component.html',
  styleUrls: ['./total-order.component.scss']
})
export class TotalOrderComponent implements OnInit {

  public readonly OrderType : OrderType[] = [
    {key: "All", value: "A"},
    {key : "Only Completed", value : "COMPLETED"},
    {key : "Only Cancelled", value : "CANCELLED"},
  ]


  public oneMonthBefore = moment(new Date()).subtract(1, 'month').toDate();
  public today = new Date();

  public fromSelectedDate = this.oneMonthBefore;
  public toSelectedDate = this.today;
  public selectedFilterMode : string = 'A';
  public allTime : boolean = false;

  constructor(private readonly statsService : StatisticsService, private readonly spinnerService : NgxSpinnerService) { }

  ngOnInit(): void {

  }

  getTotalOrder() {

  }
}

export interface OrderType {
  key: string;
  value : string;
}
