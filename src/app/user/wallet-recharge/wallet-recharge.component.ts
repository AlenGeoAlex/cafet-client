import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {IUser} from "../../domain/IUser";
import {AuthenticationService} from "../../services/authentication.service";
import {finalize} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-wallet-recharge',
  templateUrl: './wallet-recharge.component.html',
  styleUrls: ['./wallet-recharge.component.scss']
})
export class WalletRechargeComponent implements OnInit {

  public user : IUser;
  public balanceToAdd : number;
  constructor(
    private readonly router : Router,
    private readonly userService : UserService,
    private readonly authService : AuthenticationService,
    private readonly messageService : MessageService,
    private readonly spinnerService : NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.balanceToAdd = 100;
  }

  getUser(){
    this.spinnerService.show();
    this.userService.meObservable$
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          this.user = value;
        },
        error: err => {
          if(err instanceof HttpErrorResponse){
            if(err.status === 400 || err.status === 403){
              this.authService.logout();
            }

          }
          console.log(err);
        },
        complete: () => {

        }
      })
  }


  recharge() {
    if(this.balanceToAdd <= 1){
      this.messageService.add({severity: "error", detail: "The amount to be added should be greater than 0", summary: "Invalid"})
      return;
    }

    this.spinnerService.show();
    this.userService.rechargeWallet({balanceToAdd: this.balanceToAdd})
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: value => {
          window.open(value.url, "_self");
        },
        error: err => {
          this.messageService.add({severity: "error", detail: "An unknown error occurred", summary: "Invalid"})
          console.log(err)
        },
        complete: () => {

        }
      })
  }
}
