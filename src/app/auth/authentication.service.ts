import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ILoginParams, IRegistrationParams} from "../domain/Params/FormParams";
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

  loginAccount(loginParam : ILoginParams) : Observable<IUser> {
    return this.client.post<IUser>(this.apiUrl+"login/", loginParam);
  }

  setLoginData(userData : IUser){
    localStorage.setItem(UserConstants.AccessToken, userData.accessToken);
    localStorage.setItem(UserConstants.Email, userData.userEmailAddress);
    localStorage.setItem(UserConstants.UserName, userData.userFullName);
    localStorage.setItem(UserConstants.RefreshTokens, userData.refreshToken);
    localStorage.setItem(UserConstants.Role, userData.userRole)
    localStorage.setItem(UserConstants.ImageLink, userData.imageLink)
    localStorage.setItem(UserConstants.CartId, userData.cartId)

    let roleItem  = userData.userRole;
    if(roleItem == null){
      this.logout();
      return;
    }

    roleItem = roleItem.toUpperCase();
    if(roleItem === "ADMIN"){
      this.router.navigate(["/admin/"])
    }else if(roleItem === "STAFF"){
      //this.router.navigate(["/staff/"])
    }else if(roleItem === "CUSTOMER"){

    }else {
      this.router.navigate(["/404"])
    }
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
    localStorage.removeItem(UserConstants.ImageLink)
    localStorage.removeItem(UserConstants.CartId)
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
