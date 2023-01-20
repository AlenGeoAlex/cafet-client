import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IRole} from "../domain/IRole";
import {RegistrationParam} from "../domain/Params/OutputDto";
import {environment} from "../../environments/environment";
import {IUser} from "../domain/IUser";
import {AccountStatus} from "../domain/AccountStatus";
import Endpoints from "../constants/Endpoints";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly userObservable$ : Observable<IUser[]>;
  constructor(private readonly client : HttpClient) {
    this.userObservable$ = this.client.get<IUser[]>(Endpoints.User);
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
}
