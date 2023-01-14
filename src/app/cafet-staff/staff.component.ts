import { Component, OnInit } from '@angular/core';
import {CafetService} from "./services/cafet.service";
import {IEmailQuery} from "../domain/IEmailQuery";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  public showLoading : boolean;
  public currentlySelected : IEmailQuery | null;
  public suggestions : IEmailQuery[]
  public now : Date;
  constructor(private readonly cafetService : CafetService) {
    this.showLoading = false;
    this.currentlySelected = null;
    this.suggestions = [];
    this.now = new Date();
  }

  ngOnInit(): void {
  }

  search($event : any){
    if($event.query == null || $event.query.length <= 3)
      return;
    const date = new Date();
    if((date.getTime() - this.now.getTime() <= 1000))
      return;

    this.now = new Date();
    this.getSuggestion($event);
  }

  getSuggestion($event : any){
    this.cafetService.search($event.query).subscribe(
      {next: value => {
          this.suggestions = value;
        },
        error: err => {

        },
        complete: () => {

        }
      }
    )
  }


  onSelected($event: IEmailQuery) {
    var index = this.suggestions.findIndex(email => email.emailAddress == $event.emailAddress);

    if(index <= -1)
      return;

    this.currentlySelected = this.suggestions[index];
  }

  onUnselected(){
    this.currentlySelected = null;
  }
}
