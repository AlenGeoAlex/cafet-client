import { Component, OnInit } from '@angular/core';
import {ConfirmationService, LazyLoadEvent, MenuItem, MessageService, PrimeIcons} from "primeng/api";
import {IUser} from "../../domain/IUser";
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Menu} from "primeng/menu";
import {finalize} from "rxjs";
import {Router} from "@angular/router";

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

  public selectedId : number | null;

  constructor(private readonly userService: UserService,
              private readonly spinnerService : NgxSpinnerService,
              private readonly confirmationService: ConfirmationService,
              private readonly messageService : MessageService,
              private readonly router : Router,
  ) {
    this.users = [];
    this.selectedId = -1;
    this.items = [{
      label: "Manage",
      items: [
        {
          label: "Get User Activity",
          icon: PrimeIcons.USER_EDIT,
          command: event => {
            if(!this.selectedId)
              return;

            router.navigate(["admin/stats/user-activity-stats/"+this.selectedId])
          }
        },
        {
          label: "Reset Password",
          icon: "pi pi-flag",
          command: event => {
          if(!this.selectedId)
            return;

          var userOfId = this.getUserOfId(this.selectedId);
          if(!userOfId)
            return;
          this.spinnerService.show();
          this.userService.resetPassOfAnotherUser(userOfId.userEmail)
            .pipe(finalize( () => {
              this.spinnerService.hide();
            }))
            .subscribe({
              next: value => {
                this.messageService.add({severity: "success", detail: `An account password reset has been initiated for ${userOfId?.userEmail}.`})
              },
              error : (err) => {
                this.messageService.add({severity: "error", detail: `Failed to reset password for ${userOfId?.userEmail}.`})
              },
              complete: () => {

            }
            });

          }},
/*        {
          label: "Change Role",
          icon: "pi pi-pencil",
          items: [
            {
              label: "To Admin",
              icon: "pi pi-flag"
            },
            {
              label: "To Staff",
              icon: "pi pi-flag"
            },
            {
              label: "To Customer",
              icon: "pi pi-flag"
            }
          ]
        },*/
      ]
    },{
      label: "Account Settings",
      items: [
        {label: "Delete Account", icon: "pi pi-times", command: event => {
            if(this.selectedId == null)
              return;
            this.spinnerService.hide();
            this.userService.deleteUserAccount(this.selectedId)
              .pipe(
                finalize(() => {
                  this.spinnerService.hide();
                }))
              .subscribe({
                next: value => {
                  if(value){{
                    this.messageService.add({severity: "success", summary: "Deleted", detail: "The account has been deleted"})
                    const arrayIndex = this.users.findIndex(user => user.userId === this.selectedId);

                    if(arrayIndex >= 0){
                      this.users.splice(arrayIndex, 1)
                    }

                  }
                  }else this.messageService.add({severity: "error", summary: "Not Deleted", detail: "Failed to delete the account"})

                },
                error: err => {
                  console.log(err)
                  this.messageService.add({severity: "error", summary: "Not Deleted", detail: "Failed to delete the account"})
                },
                complete: () => {

                }
              })
          }}
      ]
    }
    ]
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
        this.users = this.users.filter(user => !user.deleted);
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

  getUserOfId(id : number) : IUser | null {
    const number = this.users.findIndex(user => user.userId === id);
    if(number == -1)
      return null;

    return this.users[number];
  }

  isEditEnabled(id : number) : boolean {
    var userOfId = this.getUserOfId(id);
    if(userOfId == null)
      return false;

    return userOfId.userRole !== "Customer";
  }

  onClick(userId: any, $event: MouseEvent, menu: Menu) {
    this.selectedId = userId;
    menu.toggle($event);
  }
}
