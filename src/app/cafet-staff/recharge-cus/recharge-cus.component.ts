import {Component, OnInit, ViewChild} from '@angular/core';
import {IEmailQuery} from "../../domain/IEmailQuery";
import {CafetService} from "../services/cafet.service";
import {AutoComplete} from "primeng/autocomplete";
import {IWalletRechargeParams} from "../../domain/Params/OutputDto";
import {finalize} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-recharge-cus',
  templateUrl: './recharge-cus.component.html',
  styleUrls: ['./recharge-cus.component.scss']
})
export class RechargeCusComponent implements OnInit {

  public currentlySelectedAccounts : IEmailQuery | null;
  public emailQuerySuggestion : IEmailQuery[]
  public emailQueryCoolDown : Date;

  public balanceToAdd : number;

  @ViewChild("autoComplete") autoComplete : AutoComplete;

  constructor(private readonly cafetService : CafetService, private readonly spinnerService : NgxSpinnerService, private readonly messageService : MessageService) {
    this.emailQuerySuggestion = [];
    this.currentlySelectedAccounts = null;
    this.emailQueryCoolDown = new Date();
    this.balanceToAdd = 0;
  }

  ngOnInit(): void {

  }

  searchUser($event : any){
    if($event.query == null || $event.query.length <= 3)
      return;
    const date = new Date();
    if((date.getTime() - this.emailQueryCoolDown.getTime() <= 1000))
      return;

    this.emailQueryCoolDown = new Date();
    this.getUserSuggestion($event);
  }

  getUserSuggestion($event : any){
    this.cafetService.searchUser($event.query).subscribe(
      {next: value => {
          this.emailQuerySuggestion = value;
        }
      }
    )
  }


  onAccountSelected(emailAddress: any) {
    var findIndex = this.emailQuerySuggestion.findIndex(em => em.emailAddress == emailAddress);

    if(findIndex <= -1)
      return

    this.currentlySelectedAccounts = this.emailQuerySuggestion[findIndex];
  }

  onAccountUnselected() {
    this.currentlySelectedAccounts = null;
  }

  getFullName() : string {
    if(!this.currentlySelectedAccounts)
      return "";

    return this.currentlySelectedAccounts.firstName + " " + this.currentlySelectedAccounts.lastName;
  }

  getAccountBalance() : string {
    if(!this.currentlySelectedAccounts)
      return "";

    return this.currentlySelectedAccounts.wallet.toString();
  }

  clear() {
    this.currentlySelectedAccounts = null;
    this.balanceToAdd = 0
    this.autoComplete.clear();
  }

  recharge() {
    if(!this.currentlySelectedAccounts || this.balanceToAdd == 0)
      return;

    const transferData : IWalletRechargeParams = {
      emailAddress: this.currentlySelectedAccounts.emailAddress,
      balanceToAdd: this.balanceToAdd
    };

    this.cafetService.recharge(transferData)
      .pipe(finalize(() =>
        {
          this.spinnerService.hide();
          this.clear();
        }
      ))
      .subscribe({
        next: value => {
          this.messageService.add({severity: "success", detail: "Successfully updated the user wallet balance", summary: "Updated"})
        },
        error: err => {
          if(err instanceof HttpErrorResponse){
            if(err.status != 400){
              console.log(err)
              this.messageService.add({severity: "error", detail: "An unknown error occurred while updating wallet balance, Try again later", summary: "Failed"})
            }else{
              const errorMsg = err.error ? err.error : "";
              this.messageService.add({severity: "error", detail: "Failed to update user balance. "+errorMsg, summary: "Failed"})
            }
          }
        },
        complete: () => {

        }
      })
  }
}
