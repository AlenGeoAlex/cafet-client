import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ILoginParams, IRegistrationParams} from "../domain/Params/OutputDto";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ICred} from "../domain/ICred";
import {UserConstants} from "../constants/UserConstants";
import {ActivatedRoute, Router} from "@angular/router";
import Endpoints from "../constants/Endpoints";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly apiUrl : string;
  readonly authenticationObservable$ : BehaviorSubject<string | null>
  constructor(private readonly client: HttpClient, private readonly router : Router, private readonly route : ActivatedRoute, private readonly socialAuthService: SocialAuthService) {
    this.apiUrl = `${environment.apiUrl}auth/`;
    this.authenticationObservable$ = new BehaviorSubject<string | null>(this.getUserData(UserConstants.UserName));
  }

  registerNewAccount(regParam : IRegistrationParams) : Observable<ICred> {
    return this.client.post<ICred>(Endpoints.Auth+"register/", regParam);
  }

  loginAccount(loginParam : ILoginParams) : Observable<ICred> {
    return this.client.post<ICred>(Endpoints.Auth+"login/", loginParam);
  }

  resetPassword(emailAddress : any) : Observable<any> {
    return this.client.post(Endpoints.Auth+"reset-pass/", emailAddress);
  }

  socialLogin(loginResponse : SocialUser) : Observable<ICred> {
    localStorage.clear();
    return this.client.post<ICred>(Endpoints.Auth+"social-login", loginResponse)
  }

  setLoginData(userData : ICred){
    localStorage.setItem(UserConstants.AccessToken, userData.accessToken);
    localStorage.setItem(UserConstants.Email, userData.userEmailAddress);
    localStorage.setItem(UserConstants.UserName, userData.userFullName);
    localStorage.setItem(UserConstants.RefreshTokens, userData.refreshToken);
    localStorage.setItem(UserConstants.Role, userData.userRole);
    localStorage.setItem(UserConstants.ImageLink, userData.imageLink);
    localStorage.setItem(UserConstants.CartId, userData.cartId);
    let roleItem  = userData.userRole;
    if(roleItem == null){
      this.logout();
      return;
    }
    const toRoute = this.getHomeRouteForRole(roleItem);
    this.router.navigate([toRoute]);
    this.authenticationObservable$.next(userData.userFullName);
  }

  setData(constant : UserConstants, value : string){
    localStorage.setItem(constant, value)
  }

  logout() {
    const socialLogin = localStorage.getItem(UserConstants.SocialLoginIn);
    if(socialLogin && socialLogin === "true"){
      console.log("Social Logout")
      this.socialAuthService.signOut(true)
        .then((val) => console.log(val))
        .catch((err) => console.log(err))
    }
    localStorage.removeItem(UserConstants.AccessToken);
    localStorage.removeItem(UserConstants.Email);
    localStorage.removeItem(UserConstants.UserName);
    localStorage.removeItem(UserConstants.RefreshTokens);
    localStorage.removeItem(UserConstants.Role)
    localStorage.removeItem(UserConstants.ImageLink)
    localStorage.removeItem(UserConstants.CartId)
    this.authenticationObservable$.next(null);
    this.router.navigate(["/auth/"]);
  }

  getUserData(constants : UserConstants) : string | null{
    return localStorage.getItem(constants);
  }

  isUserRegistered() : boolean {
    return this.getUserData(UserConstants.Role) != null
      && this.getUserData(UserConstants.Email) != null
      && this.getUserData(UserConstants.AccessToken) != null
  }

  getHomeRouteForRole(role : string) : string {

    switch (role.toUpperCase()){
      case "ADMIN" :
        return "/admin/";
      case "STAFF":
        return "/staff/"
      case "CUSTOMER":
        return "";
      default:
        return "/"
    }
  }
}
