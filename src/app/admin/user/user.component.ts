import { Component, OnInit } from '@angular/core';
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {IUser} from "../../domain/IUser";
import {UserService} from "./user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UsersComponent implements OnInit {

  public static AvatarColorCodes = new Map<string, string>;
  static {
    UsersComponent.AvatarColorCodes.set("Admin", "#C44829");
    UsersComponent.AvatarColorCodes.set("Staff", "#29B8C4");
    UsersComponent.AvatarColorCodes.set("Customer", "#53C429");
  }

  loading: boolean = false;

  users : IUser[];

  public readonly items : MenuItem[];

  public selectedId : number;

  constructor(private readonly userService: UserService, private readonly spinnerService : NgxSpinnerService) {
    this.selectedId = -1;
    this.items = [{
      label: "Account Settings",
      items: [
        {label: "Reset Password", icon: "pi-flag", command: event => {
          console.log(event);
          }},
        {label: "Change Role", icon: "pi-pencil"}
      ]
    }]
  }

  ngOnInit(): void {
    this.populate();
  }

  populate(){
    this.spinnerService.show();
    this.loading = true;
    this.userService.userObservable$.subscribe({
      next: value => {
        this.users = value;
      },
      error: err => {

      },
      complete: () => {
        this.spinnerService.hide();
        this.loading = false;
      }
    })
  }

  getUserRoleAvatar(roleName : string) : string {
    return roleName.charAt(0);
  }

  getUserCountFor(roleName : string) : number {
    let val = 0;
    if(this.users == null)
      return val;

    for (let user of this.users) {
      if(user.userRole === roleName)
        val++;
    }

    return val;
  }

  loadUsers($event: LazyLoadEvent) {
    console.log($event);
  }

  onClick(userId: any, $event: MouseEvent, menu: Menu) {
    this.selectedId = userId;
    menu.toggle($event);
  }
}
