import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import {HttpParams} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {IWalletHistory} from "../../domain/IWalletHistory";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss']
})
export class WalletHistoryComponent implements OnInit {

  public readonly WalletFilter : WalletFilter[] = [
    {key: "All", value: "A"},
    {key : "Only Credit", value : "C"},
    {key : "Only Debit", value : "D"},
  ]

  public oneMonthBefore = moment(new Date()).subtract(1, 'month').toDate();
  public today = new Date();

  public fromSelectedDate = this.oneMonthBefore;
  public toSelectedDate = this.today;
  public selectedFilterMode : string = 'A';
  public allTime : boolean = false;

  public history : IWalletHistory[];

  constructor(private readonly userService : UserService) {
    this.history = [];
  }

  ngOnInit(): void {
    this.fetchUserWallet();
  }

  public fetchUserWallet(){
    let params = new HttpParams();
    params = params.append("FetchMode", this.selectedFilterMode);
    if(!this.allTime){
      params = params.append("From", this.fromSelectedDate.toISOString())
      params = params.append("To", this.toSelectedDate.toISOString())
    }

    this.userService.getUserWalletHistory(params)
      .subscribe({
        next: value => {
          this.history = value;
        }
      })
  }


  mapToBody() : any {
    let a : any[] = [];
    for (let iWalletHistory of this.history) {
      a.push([iWalletHistory.date, iWalletHistory.time, iWalletHistory.amount, iWalletHistory.credit ? "Credit" : "Debit", iWalletHistory.failReason == null ? "" : iWalletHistory.failReason]);
    }

    return a;
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();
        autoTable(doc, {
          head: [['Date', 'Time', 'Amount', 'Credit/Debit' ,'Reason For Failure']],
          body: this.mapToBody(),
        })
        doc.save('products.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.history);
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

}

interface WalletFilter {
  key : string;
  value : string;
}
