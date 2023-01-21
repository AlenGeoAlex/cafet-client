import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  orderId : string;
  constructor(private readonly router : Router, private readonly activatedRoute : ActivatedRoute) {
    const id : string | null = activatedRoute.snapshot.paramMap.get("id");
    if(id == null)
    {
      router.navigate(['/404']);
      return;
    }

    this.orderId= id;
  }

  ngOnInit(): void {
  }

}
