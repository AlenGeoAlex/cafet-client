import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  constructor(private readonly fb: FormBuilder) {
    this.regGroup = fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      emailAddress : ['', Validators.required],
      password : ['', Validators.required],
      termsCheckbox: [false, Validators.required]
    });

    this.logGroup = fb.group({
      emailAddress : ['', Validators.required],
      password : ['', Validators.required],
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

  signin(){

  }

  signup(){

  }

}
