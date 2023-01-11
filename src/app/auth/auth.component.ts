import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ILoginParams, IRegistrationParams, RegistrationParam} from "../domain/Params/FormParams";
import {AuthenticationService} from "./authentication.service";
import {HttpErrorResponse, HttpResponseBase} from "@angular/common/http";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public toggleIcon : string = "password"
  public toggleIconName : string = "fa-eye"
  public mode : "sign-up-mode" | "" = "";
  public readonly regGroup : FormGroup;
  public readonly logGroup : FormGroup;
  constructor(private readonly fb: FormBuilder, private readonly authenticationService : AuthenticationService, private messageService: MessageService) {
    this.regGroup = fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      emailAddress : ['', [Validators.email, Validators.required]],
      password : ['', [Validators.required, Validators.min(5)]],
      termsCheckbox: [false, Validators.required]
    });

    this.logGroup = fb.group({
      emailAddress : ['', [Validators.email, Validators.required]],
      password : ['', [Validators.required, Validators.min(5)]],
    });
  }

  ngOnInit(): void {
  }

  toggleMode(){
    if(this.mode === ""){
      this.mode = "sign-up-mode";
      this.toggleIcon = "password"
      this.toggleIconName = "fa-eye"
    }else{
      this.mode = "";
      this.toggleIcon = "password"
      this.toggleIconName = "fa-eye"
    }
  }

  togglePassword(){
    if(this.toggleIcon === "password"){
      this.toggleIcon = "text";
      this.toggleIconName = "fa-eye-slash"
    }
    else {
      this.toggleIcon = "password"
      this.toggleIconName = "fa-eye"
    }
  }

  signin(loginParam : ILoginParams){
    this.authenticationService.loginAccount(loginParam).subscribe({
      next: value => {
        this.authenticationService.setLoginData(value);
      },
      error: err => {
        this.logGroup.reset();
        if(err instanceof HttpErrorResponse){
          const error = <HttpErrorResponse> err;
          if(err.status === 400){
            const errMessage = error.error;
            if(errMessage != null || errMessage != undefined){
              this.messageService.add({severity: "error", summary: "Failed", detail: errMessage})
            }
          } else if(err.status === 401){
            const errMessage = error.error;
            if(errMessage != null || errMessage != undefined){
              this.messageService.add({severity: "error", summary: "Denied", detail: errMessage})
            }
          } else{
            console.log(err);
            this.messageService.add({severity: "error", summary: "Failed", detail: "An unknown error occurred. Please try again later!"})
          }
        }
      },
      complete: () => {

      }
    })
  }

  signup(){
    var rawValue = this.regGroup.getRawValue();
    const param = new RegistrationParam();
    param.emailAddress = rawValue.emailAddress;
    param.firstName = rawValue.firstName;
    param.lastName = rawValue.lastName;
    param.password = rawValue.password;
    param.role = "Customer";

    this.authenticationService.registerNewAccount(param).subscribe({
      next: value => {
        this.authenticationService.setLoginData(value);
      },
      error: err => {
        this.regGroup.reset();
        if(err instanceof HttpErrorResponse){
          const error = <HttpErrorResponse> err;
          if(err.status === 400){
            const errMessage = error.error;
            if(errMessage != null || errMessage != undefined){
              this.messageService.add({severity: "error", summary: "Failed", detail: errMessage})
            }
          }else{
            console.log(err);
            this.messageService.add({severity: "error", summary: "Failed", detail: "An unknown error occurred. Please try again later!"})
          }
        }
      },
      complete: () => {

      }
    });

  }

}
