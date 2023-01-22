import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import Endpoints from "../constants/Endpoints";
import {ITTopSoldFood} from "../domain/ITTopSoldFood";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private readonly client : HttpClient) { }

  getTopSeller(count = 3) : Observable<ITTopSoldFood[]> {
    return this.client.get<ITTopSoldFood[]>(Endpoints.Statistics+"top-seller");
  }
}
