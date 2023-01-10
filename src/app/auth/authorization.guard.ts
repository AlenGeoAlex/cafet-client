import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {UserConstants} from "../constants/UserConstants";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

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

    let userRole = this.authService.getUserData(UserConstants.Role);
    if(userRole == null){
      this.authService.logout();
      return false;
    }
    userRole = userRole?.toUpperCase();

    if(role === userRole){
      return true;
    }else{
      this.authService.logout();
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(childRoute.parent)
    if(childRoute.parent != null){
      var canActivate1 = this.canActivate(childRoute.parent, state);
      console.log(canActivate1)
      return canActivate1;
    }
    else return false;
  }

}
