import {Router} from "@angular/router";

export interface IUserActivity  {
  activityId: string;
  activityType: "WalletCredit" | "WalletDebit" | "CancelledOrder" | "CompletedOrder";
  activityTypeFormatted: "Recharge on Wallet" | "Payment on Wallet" | "A cancelled order" | "A completed order";
  amount: number;
  activityOccurence: string;
  activityOccurenceRaw: number;
  activityCompleted: string;
  activityCompletedRaw: number;
  others? : string;

  color: string;
  icon: string;
  align: "right" | "left";

  message? : string;

  onClickAction : () => void;

}

export class UserActivityFunctions {
  static onOrderClick(data : any, router : Router){
    console.log(data)
    router.navigate(["/admin/stats/order-stats/"+data]);
    return;
  }

  static onWalletClick(data : any, router : Router){
    return null;
  }
}


