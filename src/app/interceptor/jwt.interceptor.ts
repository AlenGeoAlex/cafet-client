import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../auth/authentication.service";
import {environment} from "../../environments/environment";
import {UserConstants} from "../constants/UserConstants";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const isLoggedIn = this.authService.isUserRegistered();
    const isRequestToApi = request.url.startsWith(environment.apiUrl);
    const accessToken = this.authService.getUserData(UserConstants.AccessToken);
    const hasToken = accessToken != null && accessToken.length > 0;
    let shouldSkipRoute = false;

    //Urls such as auth/login doesn't necessarily need this
    for (let skipRoute of environment.skipJwt) {
      const routeUrl = environment.apiUrl + skipRoute;
      if(routeUrl === request.url){
        shouldSkipRoute = true;
        break;
      }
    }


    if(isLoggedIn && isRequestToApi && hasToken && !shouldSkipRoute){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${accessToken}`}
      });
    }

    return next.handle(request);
  }
}
