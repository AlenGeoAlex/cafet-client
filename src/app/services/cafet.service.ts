import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {IEmailQuery} from "../domain/IEmailQuery";
import {IDailyStock} from "../domain/IDailyStock";
import {StaffFoodOrder} from "../domain/StaffFoodOrder";
import {IProcessedOrder} from "../domain/IProcessedOrder";
import {IWalletRechargeParams} from "../domain/Params/OutputDto";
import Endpoints from "../constants/Endpoints";

@Injectable({
  providedIn: 'root'
})
export class CafetService {


  constructor(private readonly client : HttpClient) {

  }

  searchUser(queryString : string) : Observable<IEmailQuery[]> {
    return this.client.get<IEmailQuery[]>(`${Endpoints.Search}users?queryString=${queryString}`);
  }

  getUserOfEmailAddress(emailAddress : string) : Observable<IEmailQuery>{
    return this.client.get<IEmailQuery>(`${Endpoints.Search}user?queryString=${emailAddress}`);
  }

  searchStockFood(queryString : string) : Observable<IDailyStock[]> {
    return this.client.get<IDailyStock[]>(`${Endpoints.Search}stocks?queryString=${queryString}`)
  }

  getStockOfFood(id : number) : Observable<IDailyStock> {
    return this.client.get<IDailyStock>(`${Endpoints.Stock}food/${id}`);
  }

  order(order : StaffFoodOrder) : Observable<IProcessedOrder> {
    return this.client.post<IProcessedOrder>(Endpoints.Order+"staff/", order);
  }

  recharge(params : IWalletRechargeParams) : Observable<any>   {
    return this.client.post<any>(Endpoints.User+"wallet-recharge", params)
  }
}
