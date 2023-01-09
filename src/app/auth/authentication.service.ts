import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IRegistrationParams} from "../domain/Params/FormParams";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {IUser} from "../domain/IUser";
import {UserConstants} from "../constants/UserConstants";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly apiUrl : string;
  constructor(private readonly client: HttpClient, private readonly router : Router, private readonly route : ActivatedRoute) {
    this.apiUrl = `${environment.apiUrl}auth/`;
  }

  registerNewAccount(regParam : IRegistrationParams) : Observable<IUser> {
    return this.client.post<IUser>(this.apiUrl+"register/", regParam);
  }

  setLoginData(userData : IUser){
    localStorage.setItem(UserConstants.AccessToken, userData.AccessToken);
    localStorage.setItem(UserConstants.Email, userData.UserEmailAddress);
    localStorage.setItem(UserConstants.UserName, userData.UserFullName);
    localStorage.setItem(UserConstants.RefreshTokens, userData.RefreshToken);
    localStorage.setItem(UserConstants.Role, userData.UserRole)
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(returnUrl);
  }

  setData(constant : UserConstants, value : string){
    localStorage.setItem(constant, value)
  }

  logout() {
    localStorage.removeItem(UserConstants.AccessToken);
    localStorage.removeItem(UserConstants.Email);
    localStorage.removeItem(UserConstants.UserName);
    localStorage.removeItem(UserConstants.RefreshTokens);
    localStorage.removeItem(UserConstants.Role)
    this.router.navigate(["/auth/"]);
  }

  getUserData(constants : UserConstants) : string | null{
    return localStorage.getItem(constants);
  }

  isUserRegistered() : boolean {
    return this.getUserData(UserConstants.Role) != null
            && this.getUserData(UserConstants.AccessToken) != null
  }
}
