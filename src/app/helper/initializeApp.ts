import {AuthenticationService} from "../auth/authentication.service";
import {Observable, Subscription} from "rxjs";

export function initializeApp(authService : AuthenticationService) : () => Observable<any>{
  console.log("Auth Service is called!")

  return () => new Observable<any>();
}

