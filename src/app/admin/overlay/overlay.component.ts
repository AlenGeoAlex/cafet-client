import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  public items: MenuItem[];

  constructor() {
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
    console.log("Log out")
  }

  ngOnInit(): void {

  }

}
