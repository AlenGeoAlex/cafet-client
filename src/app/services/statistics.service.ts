import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import Endpoints from "../constants/Endpoints";
import {ITTopSoldFood} from "../domain/ITTopSoldFood";
import {IProcessedOrder} from "../domain/IProcessedOrder";
import {ICompletedOrderView, IStaffOrderView} from "../domain/IStaffOrderView";
import {IUser} from "../domain/IUser";
import {IUserActivity} from "../domain/IUserActivity";
import {IRevenueReport} from "../domain/IRevenueReport";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private readonly client : HttpClient) { }

  getTopSeller(count = 3) : Observable<ITTopSoldFood[]> {
    return this.client.get<ITTopSoldFood[]>(Endpoints.Statistics+"top-seller");
  }

  getOrderReportStats(params : string) : Observable<IStaffOrderView[]>{
    return this.client.get<IStaffOrderView[]>(Endpoints.Statistics+"order"+"?"+params);
  }

  getActivityOfUser(params : string) : Observable<IUserActivity[]> {
    return this.client.get<IUserActivity[]>(Endpoints.Statistics+"activity"+"?"+params);
  }

  getOrderReport(orderId : string) : Observable<ICompletedOrderView>{
    return this.client.get<ICompletedOrderView>(Endpoints.Statistics+"order-id"+"?"+orderId);
  }

  getRevenueOfYear(year : string){
    return this.client.get<IRevenueReport[]>(Endpoints.Statistics+"revenue"+"?yr="+year);
  }
}
