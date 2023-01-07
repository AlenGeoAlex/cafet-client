import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  name="myfile"

  constructor(private readonly primeNgConfig : PrimeNGConfig) {
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
  }


  upload($event: any) {
    console.log(typeof $event);
  }
}
