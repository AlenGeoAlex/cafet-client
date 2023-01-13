import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/authentication.service";
import {MenuItem} from "primeng/api";
import {UserConstants} from "../../constants/UserConstants";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-staff-navbar',
  templateUrl: './staff-navbar.component.html',
  styleUrls: ['./staff-navbar.component.scss']
})
export class StaffNavbarComponent implements OnInit {

  public menuItem : MenuItem[];
  public imageLink : string | null;
  public userFullName : string | null;

  constructor(private readonly authService : AuthenticationService) {
    this.imageLink = this.authService.getUserData(UserConstants.ImageLink);
    this.userFullName = this.authService.getUserData(UserConstants.UserName);
    this.buildMenu();
  }


  ngOnInit(): void {

  }



  buildMenu() {
    this.menuItem = [
      {
        label: (this.userFullName) ? this.userFullName : "Unknown",
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

  openMenu($event: MouseEvent, menu: Menu) {
    menu.show($event);
    console.log(1);
  }

  open($event : any){

  }
}
