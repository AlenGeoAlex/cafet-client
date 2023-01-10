import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../auth/authentication.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserConstants} from "../../constants/UserConstants";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  public items: MenuItem[];
  public iLink : string | null  = null;
  constructor(private readonly authService : AuthenticationService,private readonly spinnerService:NgxSpinnerService) {
    this.items = [
      {
        label: 'Administration',
        items: [
            {
              label: 'Category',
              icon: 'pi pi-hashtag',
              routerLink: "/admin/category"
          },
          {
            label: 'Food',
            icon: 'pi pi-circle',
            routerLink: "/admin/food"
          },
          {
            label: 'User',
            icon: 'pi pi-user',
            url: "/admin/users"
          },
        ]
      },
      {
        label: 'Account',
        items: [{
          label: 'Logout',
          icon: 'pi pi-lock',
          command: () => {
            this.logout()
            }
          },
          ]
      }
    ];
  }


  logout() {
    this.authService.logout()
  }

  ngOnInit(): void {
    const imageLink = this.authService.getUserData(UserConstants.ImageLink);
    if(imageLink != null && imageLink.length > 0)
      this.iLink = imageLink;
  }

}
