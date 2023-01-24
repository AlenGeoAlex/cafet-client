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

  order(food : FoodOrder) : Observable<IProcessedOrder> {
    return this.client.post<IProcessedOrder>(Endpoints.Order+"me", food);
  }

  rechargeWallet(param : IWalletRechargeParams) : Observable<unknown> {
    return this.client.post<unknown>(Endpoints.User+"wallet-recharge", param);
  }

  getUserWalletHistory(param : HttpParams) : Observable<IWalletHistory[]> {
    return this.client.get<IWalletHistory[]>(Endpoints.User+"wallet-history?"+param.toString());
  }
}
