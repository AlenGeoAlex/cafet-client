import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IRole} from "../../domain/IRole";
import {RegistrationParam} from "../../domain/Params/FormParams";
import {environment} from "../../../environments/environment";
import {IUser} from "../../domain/IUser";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly authUrl : string;
  private readonly userUrl : string;
  public readonly userObservable$ : Observable<IUser[]>;
  constructor(private readonly client : HttpClient) {
    this.authUrl = environment.apiUrl+"auth/";
    this.userUrl = environment.apiUrl+"users/";
    this.userObservable$ = this.client.get<IUser[]>(this.userUrl);
  }

  registerNewUser(regParam : RegistrationParam) : Observable<any>{
    return this.client.post<any>(this.authUrl+"register", regParam);
  }
}
