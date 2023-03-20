import { Component, OnInit } from '@angular/core';
import {StatisticsService} from "../../../services/statistics.service";
import {finalize} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {IRevenueReport} from "../../../domain/IRevenueReport";
import {StatisticsConstants} from "../../../constants/StatisticsConstants";

@Component({
  selector: 'app-revenuve-stats',
  templateUrl: './revenuve-stats.component.html',
  styleUrls: ['./revenuve-stats.component.scss']
})
export class RevenuveStatsComponent implements OnInit {

  public basicData : any;
  private readonly today = new Date();

  public selectedYear : number;

  public yearSelection : KeyValue[] = [];

  public rawData : IRevenueReport[] = [];
  public basicOptions : any;
  constructor(
    private readonly statsService : StatisticsService,
    private readonly spinnerService : NgxSpinnerService
  ) {
    for(let start = this.today.getFullYear(); start >= this.today.getFullYear() - 10; start-=1){
      this.yearSelection.push({key: `${start}`, value: `${start}`})
    }
    this.selectedYear = this.today.getFullYear();
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

  ngOnInit(): void {
    this.getData();
  }

  downloadReport(){
    import("xlsx").then(xlsx => {
      if(!this.rawData)
      {
        return;
      }
      this.spinnerService.show();
      const worksheet = xlsx.utils.json_to_sheet(this.rawData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "revenuereport");
      this.spinnerService.hide();
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

  getData(){
    this.spinnerService.show();
    this.statsService.getRevenueOfYear(this.selectedYear.toString())
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: value => {
          this.rawData = value;
          this.toGraphical();
        },
        error: err => {

        },
        complete: () => {

        }
      })
  }

  toGraphical(){
    if(!this.rawData){
      this.basicData = null;
      return;
    }

    this.basicData = {
      labels: StatisticsConstants.MonthNames,
      datasets: [
        {
          label: "Revenue",
          fill: false,
          borderColor: '#42A5F5',
          tension: .4,
          data: this.scrapData(),
        }
      ]
    }

    console.log(this.basicData)
  }

  scrapData() : number[] {
    const array : number[] = [];
    if(!this.rawData)
      return array;

    for(var i = 0; i<= 11;i++){
      array[i] = 0;
    }

    for (let rawDatum of this.rawData) {
      if(rawDatum.month <= 0)
        continue;

      array[rawDatum.month - 1] = rawDatum.revenue;
    }

    return array;
  }

}
interface KeyValue {
  key: string;
  value : string;
}
