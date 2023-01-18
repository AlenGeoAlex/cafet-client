import { Component, OnInit } from '@angular/core';
import {IRole} from "../../../domain/IRole";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ILoginParams, RegistrationParam} from "../../../domain/Params/OutputDto";
import {UserService} from "../user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize, pipe} from "rxjs";

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.scss']
})
export class UserRegComponent implements OnInit {

  public selectedRole : IRole;
  public readonly UserRegForm: FormGroup;
  public readonly roles : string[] = [
    "Admin",
    "Staff",
    "Customer",
  ];

  constructor(private readonly fb : FormBuilder, private readonly userSer : UserService, private readonly spinnerService : NgxSpinnerService) {
    this.selectedRole = {RoleName: "Admin"};
    this.UserRegForm = this.fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      emailAddress : ['', [Validators.email, Validators.required]],
      role: ["", Validators.required],
    });

  }

  ngOnInit(): void {
  }

  onClick(rawValue: RegistrationParam) {
    this.spinnerService.show();
    this.userSer.registerNewUser(rawValue)
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        }))
      .subscribe({
      next: value => {
        console.log(value);
      },
      error : err => {

      }
    })
  }

}
