import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {UserConstants} from "../constants/UserConstants";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly authService : AuthenticationService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(!this.authService.isUserRegistered()){
      this.authService.logout();
      return false;
    }

    if(route.data == null)
        return true;

    const role = route.data["ROLE"];
    if(role == null)
      return true;

    const userRole = this.authService.getUserData(UserConstants.Role);

    if(userRole == null){
      this.authService.logout();
      return false;
    }

    if(role === userRole){
      return true;
    }else{
      this.authService.logout();
      return false;
    }
  }

}
