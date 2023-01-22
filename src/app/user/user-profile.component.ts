import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {UserService} from "../services/user.service";
import {UserConstants} from "../constants/UserConstants";
import {finalize} from "rxjs";
import {IUser} from "../domain/IUser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public menuItem : MenuItem[];
  public user : IUser;
  public userFormGroup : FormGroup;
  public showConfPassword : boolean;
  public imageFile : File | null;
  public imageUrl : string;
  public confirmPassComponent : ElementRef;
  @ViewChild("passComponent") passwordComponent : ElementRef;
  @ViewChild("fileComponent") fileComponent : ElementRef;
  confirmPassword: any;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router : Router,
    private readonly spinnerService : NgxSpinnerService,
    private readonly userService : UserService,
    private readonly messageService : MessageService,
    private readonly formBuilder : FormBuilder
    ) {
    this.showConfPassword = false;
    this.imageUrl = "";
    this.userFormGroup = formBuilder.group({
      FirstName : ['', [Validators.required]],
      LastName : ['', [Validators.required]],
      PhoneNumber : [''],
      Password : ['', []],
      ConfPassword : ['', []],
    })
    this.imageFile = null;
  }

  ngOnInit(): void {
    this.spinnerService.show();

    this.getUser();
  }

  getUser() {
    this.userService.meObservable$.pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe({
      next: value => {
        this.user = value;
        this.imageUrl = this.user.userImage;
        this.patchUser();
        this.buildMenu();
      },
      error: err => {
        this.messageService.add({severity: "error", detail: "Failed to load user details", summary: "Unknown error"})
        console.log(err);
        this.router.navigate(['/404']);
      },
      complete: () => {

      }
    })
  }

  patchUser() {
    this.userFormGroup.patchValue({
      FirstName: this.user?.userFirstName,
      LastName: this.user?.userLastName,
      PhoneNumber: this.user?.phoneNumber,
    })
  }

  buildMenu() {
    this.menuItem = [
      {
        label: (this.user?.userName) ? this.user.userName : "Unknown",
        items: [
          {
            label: "Profile",
            icon: "pi pi-users",
            url: ""
          },
          {
            label: "Logout",
            icon: "pi pi-lock",
            command: event => {
              this.authService.logout();
            }
          }
        ]
      },
    ];
  }

  getUserHome() : string{
    if(this.user == null)
      return "/";

    return this.authService.getHomeRouteForRole(this.user?.userRole);
  }

  passWordInput() {
    const typingPass = this.passwordComponent.nativeElement.value;
    if(typingPass == null || typingPass.length <= 0)
      this.showConfPassword = false;
    else this.showConfPassword = true;
  }

  isValid() : boolean {
    if(this.userFormGroup.invalid)
      return false;


    if(this.showConfPassword){
      if(this.userFormGroup.get("ConfPassword") === null)
        return false;

      if(this.userFormGroup.get("Password") === null)
        return false;

      const password = this.userFormGroup.get("Password")?.value;
      const confirmPassword = this.userFormGroup.get("ConfPassword")?.value;
      if(confirmPassword !== password){
        return false;
      }
    }

    return true;
  }

  submitChanges() {

    if(!this.checkPassword())
      return;


    if(this.user == null)
      return;

    const formData = new FormData();
    formData.append("FirstName", this.userFormGroup.get("FirstName")?.value);
    formData.append("LastName", this.userFormGroup.get("LastName")?.value);
    formData.append("PhoneNumber", this.userFormGroup.get("PhoneNumber")?.value);
    formData.append("Password", this.userFormGroup.get("Password")?.value);
    formData.append("Image", (this.imageFile == null) ? "" : this.imageFile);
    formData.append("EmailAddress", this.user?.userEmail);

    this.spinnerService.show();
    this.userService.updateUserProfile(formData)
      .pipe(finalize(() => {
        this.spinnerService.hide();
        this.userFormGroup.reset();
        this.showConfPassword = false;
        this.passwordComponent.nativeElement.value = "";
      }))
      .subscribe({
        next: value => {
          this.user = value;
          this.authService.setData(UserConstants.UserName, this.user.userName);
          this.authService.setData(UserConstants.ImageLink, this.user.userImage);
          this.getUser();
          this.messageService.add({severity: "success", summary: "Updated", detail:"Your profile has been updated"})
        },
        error: err => {
          console.log(err)
          this.messageService.add({severity: "error", summary: "Failed", detail:"Failed to update the profile!"})
        },
        complete: () => {

        }
      })
  }

  checkPassword() : boolean {
    const password = this.userFormGroup.get("Password")?.value;
    if(password > 0 && password < 8){
      this.messageService.add({severity: "error", summary: "Password", detail: "Password must be least of 8 characters"})
      return false;
    }

    return true;
  }

  onImageUploadClick() {
    this.fileComponent.nativeElement.click();
  }

  onFileUpload($event: any) {
    const filesList = $event.files

    if(filesList.length <= 0)
      return;

    this.imageFile = filesList[0];
    if(this.imageFile == null)
      return;

    var fileReader = new FileReader();
    fileReader.readAsDataURL(this.imageFile)
    fileReader.onload = (event) => {
      if(event.target == null)
        return;

      const result = event.target.result;
      if(typeof result === "string"){
        this.imageUrl = result;
      }
    }


  }

}
