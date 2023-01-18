import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IFood, SelectedFood} from "../../domain/IFood";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {IDailyStock} from "../../domain/IDailyStock";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  public readonly foodObservable$ : Observable<IFood[]>;
  public readonly stockObservable$ : Observable<IDailyStock[]>;
  public readonly foodUrl : string;
  public readonly stockUrl : string;
  constructor(private readonly client : HttpClient) {
    this.foodUrl = environment.apiUrl + "food/";
    this.stockUrl = environment.apiUrl+ "stock/";
    this.foodObservable$ = this.client.get<IFood[]>(this.foodUrl);
    this.stockObservable$ = this.client.get<IDailyStock[]>(this.stockUrl);
  }

  registerStock(selectedFood : SelectedFood[]) : Observable<any>{
    return this.client.post<any>(this.stockUrl+"register/?clear=1", selectedFood);
  }

  addNewSingleStock(selectedFood : SelectedFood) : Observable<any> {
    return this.client.post<any>(this.stockUrl+"register/", [selectedFood]);
  }

  deleteStock(id : number) : Observable<any> {
    return this.client.delete<any>(this.stockUrl+"delete/"+id);
  }

  deleteMultipleStock(id : number[]) : Observable<any> {
    return this.client.post<any>(this.stockUrl+"delete", id);
  }

  updateQuantity(stock : IDailyStock) : Observable<any>{
    return this.client.post<any>(this.stockUrl+"update", stock);
  }
}
