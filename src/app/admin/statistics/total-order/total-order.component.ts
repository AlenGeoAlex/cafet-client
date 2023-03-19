import { Component, OnInit } from '@angular/core';
import * as moment from "moment/moment";
import {StatisticsService} from "../../../services/statistics.service";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs";
import {IProcessedOrder} from "../../../domain/IProcessedOrder";
import { StatisticsConstants} from "../../../constants/StatisticsConstants";
import {IStaffOrderView} from "../../../domain/IStaffOrderView";
import {DateUtils} from "../../../helper/DateUtils";

@Component({
  selector: 'app-total-order',
  templateUrl: './total-order.component.html',
  styleUrls: ['./total-order.component.scss']
})
export class TotalOrderComponent implements OnInit {

  public readonly OrderType : KeyValue[] = [
    {key: "All", value: "A"},
    {key : "Only Completed", value : "COMPLETED"},
    {key : "Only Cancelled", value : "CANCELLED"},
  ]

  public readonly PaymentType : KeyValue[] = [
    {key: "Any", value: "0"},
    {key: "Wallet", value: "1"},
    {key: "Card/Cash", value: "2"}
  ]


  public oneMonthBefore = moment(new Date()).subtract(1, 'month').toDate();
  public today = new Date();

  public fromSelectedDate = this.oneMonthBefore;
  public toSelectedDate = this.today;
  public selectedFilterMode : string = 'A';
  public selectedPaymentType : string = '0';
  public allTime : boolean = false;

  public rawData : IStaffOrderView[] | null;
  public graphicalData : any | null;
  public readonly basicOptions : any;

  constructor(private readonly statsService : StatisticsService, private readonly spinnerService : NgxSpinnerService) {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }

  downloadReport(){
    import("xlsx").then(xlsx => {
      if(!this.rawData)
      {
        return;
      }
      const worksheet = xlsx.utils.json_to_sheet(this.rawData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
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

  ngOnInit(): void {
    this.rawData = null;
    this.getTotalOrder();
  }

  toGraphical(){
    if(!this.rawData){
      this.graphicalData = null;
      return;
    }

    var scrappedOrderChartData = this.scrapData();

    this.graphicalData = {
      labels : StatisticsConstants.MonthNames,
      datasets: [
        {
          label: "Prepaid Orders",
          backgroundColor: '#42A5F5',
          data: scrappedOrderChartData.Wallet
        },
        {
          label: "Cash/Card Orders",
          backgroundColor: '#FFA726',
          data: scrappedOrderChartData.CashCard
        }
      ]
    }
  }

  scrapData() : ScrappedOrderChartData {
    const data : ScrappedOrderChartData = {
      CashCard: [],
      Wallet: []
    }


    if(!this.rawData)
      return data;

    for(var i = 0; i<= 11; i++){
      data.Wallet[i] = 0;
      data.CashCard[i] = 0;
    }

    for (let eachOrder of this.rawData) {
      var ddMmYyyy = DateUtils.getDdMmYyyy(eachOrder.orderedDate);
      if(!ddMmYyyy)
        continue;

      if(ddMmYyyy.getMonth() <= 0)
        continue;

      if(ddMmYyyy.getFullYear() != this.today.getFullYear())
        continue;

      if(eachOrder.paymentMethod){
        data.Wallet[ddMmYyyy.getMonth()] +=1;
      }else{
        data.CashCard[ddMmYyyy.getMonth()] +=1;
      }
    }

    return data;
  }

  getTotalOrder() {
    this.spinnerService.show();
    this.statsService.getOrderReportStats(this.buildQuery())
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: value => {
          console.log(value)
          this.rawData = value;
          this.toGraphical();
        },
        error: err => {

        },
        complete: () => {

        }
      })
  }

  buildQuery() : string {
    const params = new URLSearchParams();
    if(this.selectedFilterMode === "COMPLETED"){
      params.append("onlyCompleted", "true")
    }

    if(this.selectedFilterMode === "CANCELLED"){
      params.append("onlyCancelled", "true")
    }

    if(!this.allTime){
      params.append("from", this.fromSelectedDate.toISOString());
      params.append("to", this.toSelectedDate.toISOString());
    }

    if(this.selectedPaymentType !== '0'){
      params.append("paymentMethod", this.selectedPaymentType)
    }
    return params.toString();
  }
}

export interface KeyValue {
  key: string;
  value : string;
}

interface ScrappedOrderChartData {
  CashCard: number[];
  Wallet : number[];
}
