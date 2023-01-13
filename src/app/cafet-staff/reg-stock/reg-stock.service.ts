import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IFood} from "../../domain/IFood";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegStockService {

  public readonly foodObservable$ : Observable<IFood[]>;
  public readonly foodUrl : string;
  constructor(private readonly client : HttpClient) {
    this.foodUrl = environment.apiUrl + "food";
    this.foodObservable$ = this.client.get<IFood[]>(this.foodUrl);
  }
}
