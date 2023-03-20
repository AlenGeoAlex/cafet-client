import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StatisticsService} from "../../../services/statistics.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService, PrimeIcons} from "primeng/api";
import * as moment from "moment";
import {KeyValue} from "../total-order/total-order.component";
import {finalize} from "rxjs";
import {IUserActivity, UserActivityFunctions} from "../../../domain/IUserActivity";

@Component({
  selector: 'app-user-activity-stats',
  templateUrl: './user-activity-stats.component.html',
  styleUrls: ['./user-activity-stats.component.scss']
})
export class UserActivityStatsComponent implements OnInit {

  private readonly userId : string;

  public oneMonthBefore = moment(new Date()).subtract(1, 'month').toDate();
  public today = new Date();

  public fromSelectedDate = this.oneMonthBefore;
  public toSelectedDate = this.today;
  public selectedFilterMode : string = '0';
  public allTime : boolean = false;
  public activityRaw : IUserActivity[];
  public timeLine : any;

  public readonly OrderType : KeyValue[] = [
    {key: "All", value: "0"},
    {key : "Only Order", value : "1"},
    {key : "Only Wallet History", value : "2"},
  ]

  constructor(
    private readonly router : Router,
    private readonly activatedRoute : ActivatedRoute,
    private readonly statsService : StatisticsService,
    private readonly spinnerService : NgxSpinnerService,
    private readonly messageService : MessageService,
  ) {
    const uId = activatedRoute.snapshot.paramMap.get("userId");
    if(!uId)
    {
      this.router.navigate(['/404/']);
      return;
    }

    this.userId = uId;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.spinnerService.show();
    this.statsService.getActivityOfUser(this.buildQuery())
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: value => {
            this.activityRaw = value;
            this.toTimeLine();
        },
        error: err => {
          console.log(err)
          this.messageService.add({severity: "error", summary: "Unknown Error", detail: "An unknown error occurred!"})
        },
        complete: () => {

        }
      })
  }

  toTimeLine(){
    for (let iUserActivity of this.activityRaw) {
      if(iUserActivity.activityType === "WalletCredit"){
        iUserActivity.align = "left";
        iUserActivity.color = "#05D417"
        iUserActivity.icon = PrimeIcons.WALLET
        iUserActivity.activityTypeFormatted = "Recharge on Wallet";
        iUserActivity.message = `You have recharged your wallet by amount ${iUserActivity.amount}`;
        iUserActivity.onClickAction;

      }else if(iUserActivity.activityType === "WalletDebit"){
        iUserActivity.align = "left";
        iUserActivity.color = "#DA3B18"
        iUserActivity.icon = PrimeIcons.WALLET
        iUserActivity.activityTypeFormatted = "Payment on Wallet";
        iUserActivity.message = `You have bought from your wallet with amount ${iUserActivity.amount}`;
        iUserActivity.onClickAction;

      }else if(iUserActivity.activityType === "CancelledOrder"){
        iUserActivity.align = "right";
        iUserActivity.color = "#DA3B18"
        iUserActivity.icon = PrimeIcons.SHOPPING_CART
        iUserActivity.activityTypeFormatted = "A cancelled order";
        iUserActivity.message = `You have made an order for ${iUserActivity.others} for amount ${iUserActivity.amount}, Unfortunately the order was cancelled at ${iUserActivity.activityCompleted}`
        iUserActivity.onClickAction = () => UserActivityFunctions.onOrderClick(iUserActivity.activityId, this.router);

      }else if(iUserActivity.activityType === "CompletedOrder"){
        iUserActivity.align = "right";
        iUserActivity.color = "#05D417"
        iUserActivity.icon = PrimeIcons.SHOPPING_CART
        iUserActivity.activityTypeFormatted = "A completed order";
        iUserActivity.message = `You have made an order for ${iUserActivity.others} for amount ${iUserActivity.amount} and was delivered on ${iUserActivity.activityCompleted}`
        iUserActivity.onClickAction = () => UserActivityFunctions.onOrderClick(iUserActivity.activityId, this.router)

      }
    }

    this.timeLine = this.activityRaw;
  }

  buildQuery() : string {
    const params = new URLSearchParams();
    params.append("user", this.userId);
    if(this.selectedFilterMode !== "0"){
      params.append("activityType", this.selectedFilterMode);
    }

    if(!this.allTime){
      params.append("from", this.fromSelectedDate.toISOString());
      params.append("to", this.toSelectedDate.toISOString());
    }
    return params.toString();
  }
}
