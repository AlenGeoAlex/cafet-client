import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {IRole} from "../domain/IRole";
import {IWalletRechargeParams, RegistrationParam} from "../domain/Params/OutputDto";
import {environment} from "../../environments/environment";
import {IUser} from "../domain/IUser";
import {AccountStatus} from "../domain/AccountStatus";
import Endpoints from "../constants/Endpoints";
import {FoodOrder} from "../domain/StaffFoodOrder";
import {IProcessedOrder} from "../domain/IProcessedOrder";
import {IWalletHistory} from "../domain/IWalletHistory";
import {IStaffOrderView} from "../domain/IStaffOrderView";
import {IStripSessionUrl} from "../domain/IStripSessionUrl";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly userObservable$ : Observable<IUser[]>;
  public readonly meObservable$ : Observable<IUser>;
  constructor(private readonly client : HttpClient) {
    this.userObservable$ = this.client.get<IUser[]>(Endpoints.User);
    this.meObservable$ = this.client.get<IUser>(Endpoints.User+"me");
  }

  registerNewUser(regParam : RegistrationParam) : Observable<any>{
    return this.client.post<any>(Endpoints.Auth+"register", regParam);
  }

  resetPassOfAnotherUser(selectedUser : string) : Observable<any>{
    return this.client.post<any>(Endpoints.Auth+"reset-pass", {"emailAddress": selectedUser})
  }

  deleteUserAccount(id : number) : Observable<boolean> {
    const statusData = new AccountStatus();
    statusData.accountId = id;
    return this.client.post<boolean>(Endpoints.User+"delete", statusData);
  }

  getUserOfEmailAddress(emailAddress : string) : Observable<IUser> {
    return this.client.get<IUser>(Endpoints.User+"email/"+emailAddress);
  }

  updateUserProfile(formData : FormData) : Observable<IUser> {
    return this.client.post<IUser>(Endpoints.User+"update", formData);
  }

  order(food : FoodOrder) : Observable<IProcessedOrder | IStripSessionUrl> {
    return this.client.post<IProcessedOrder>(Endpoints.Order+"me", food);
  }

  rechargeWallet(param : IWalletRechargeParams) : Observable<IStripSessionUrl> {
    return this.client.post<IStripSessionUrl>(Endpoints.User+"wallet-recharge", param);
  }

  getUserWalletHistory(param : HttpParams) : Observable<IWalletHistory[]> {
    return this.client.get<IWalletHistory[]>(Endpoints.User+"wallet-history?"+param.toString());
  }

  getOrders(param : HttpParams) : Observable<IStaffOrderView[]> {
    return this.client.get<IStaffOrderView[]>(Endpoints.User+"my-orders?"+param.toString());
  }
}
