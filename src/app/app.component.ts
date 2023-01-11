import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {AuthenticationService} from "./auth/authentication.service";
import {Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


  constructor(private readonly primeNgConfig : PrimeNGConfig, private readonly authService : AuthenticationService) {

  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;

  }

}
