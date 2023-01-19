import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {finalize} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {

  public readonly emailForm : FormGroup;

  constructor(private readonly fb : FormBuilder,
              private readonly authService : AuthenticationService,
              private readonly spinnerService : NgxSpinnerService,
              private readonly messageService : MessageService,
              private readonly activatedRoute : ActivatedRoute,
  ) {
    const emailAddress = activatedRoute.snapshot.paramMap.get("email");
    this.emailForm = fb.group({
      emailAddress : [(emailAddress == null) ? "" : emailAddress, [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
  }

  onReset(){
    if(this.emailForm.invalid)
      return;

    this.spinnerService.show();

    this.authService.resetPassword(this.emailForm.getRawValue())
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next : value => {
          this.messageService.add({severity:"success", detail: "Please check your corresponding email address for more", summary: "Done!"})
        },
        error: err => {
          if(err instanceof HttpErrorResponse){
            if(err.status === 400){
              if(err.error){
                this.messageService.add({severity: "error", detail: err.error, summary: "Failed"})
              }else{
                this.messageService.add({severity: "error", detail: "An unknown error occurred!", summary: "Failed"})

              }
            }

            console.log(err);
          }
        },
        complete: () => {

        }
      })
  }

}
