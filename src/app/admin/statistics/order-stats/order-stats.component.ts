import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StatisticsService} from "../../../services/statistics.service";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs";
import {ICompletedOrderView, IStaffOrderView, OrderedFood} from "../../../domain/IStaffOrderView";
import {PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-order-stats',
  templateUrl: './order-stats.component.html',
  styleUrls: ['./order-stats.component.scss']
})
export class OrderStatsComponent implements OnInit {

  private readonly id : string;
  public order : ICompletedOrderView | null;
  public timeLine : Timeline[] | null;

  constructor(private readonly router : Router,
              private readonly activatedRouter : ActivatedRoute,
              private readonly statsService : StatisticsService,
              private readonly spinnerService : NgxSpinnerService,
  ) {
    var orderId = this.activatedRouter.snapshot.paramMap.get("orderId");

    if(!orderId){
      this.router.navigate(["/404"])
      return;
    }

    this.id = orderId;
  }

  ngOnInit(): void {
    let urlBuilder = new URLSearchParams();
    urlBuilder.append("orderId", this.id);

    this.spinnerService.show();

    this.statsService.getOrderReport(urlBuilder.toString())
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
      next: value => {
        console.log(value);
        this.order = value;
        this.buildTimeLine();
      },
      error: err => {

      },
      complete: () => {

      }
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      if(!this.order || !this.order.orderedFoods)
        return;
      const orderedFoods : OrderedFood[] = structuredClone(this.order.orderedFoods)
      for (let orderedFood of orderedFoods) {
        orderedFood.foodId = -99;
        orderedFood.foodImageUrl = "";
      }
      const worksheet = xlsx.utils.json_to_sheet(orderedFoods);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "order-"+this.id);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    var FileSaver = require('file-saver');
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  buildTimeLine(){
    if(!this.order)
    {
      this.timeLine = null;
      return;
    }

    this.timeLine = [];
    this.timeLine[0] = {
      status: "Order Placed",
      date: `${this.order.orderedDate} ${this.order.orderedTime}`,
      icon: PrimeIcons.SHOPPING_CART,
      color: '#9C27B0'
    };

    this.timeLine[1] = {
      status: this.order.paymentStatus === 1 ? "Payment Received" : "Payment Failed",
      date: this.order.paymentStatusUpdatedAt !== null ?`${this.order.paymentStatusUpdatedAt}` : " -- ",
      icon: PrimeIcons.COG,
      color: '#673AB7'
    };

    if(!this.order.isFinished){
      this.timeLine[2] = {
        status: "Order Processing",
        date: this.order.paymentStatusUpdatedAt !== null ?`${this.order.paymentStatusUpdatedAt}` : " -- ",
        icon: PrimeIcons.ENVELOPE,
        color: '#FF9800'
      };
    }else{
      if(this.order.isCancelled){
        this.timeLine[2] = {
          status: "Order Cancelled",
          date: this.order.orderCancelledAt !== null ?`${this.order.orderCancelledAt}` : " -- ",
          icon: PrimeIcons.TIMES,
          color: '#DA3B18'
        };
      }else{
        this.timeLine[2] = {
          status: "Order Delivered",
          date: this.order.orderDeliveredAt !== null ?`${this.order.orderDeliveredAt}` : " -- ",
          icon: PrimeIcons.CHECK,
          color: '#3EDA18'
        };
      }
    }
  }
}

interface Timeline {
  status : string;
  date : string;
  icon : string;
  color : string
}
