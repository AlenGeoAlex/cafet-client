import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import Endpoints from "../constants/Endpoints";
import {AuthenticationService} from "../services/authentication.service";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private readonly router : Router, private readonly messageService : MessageService, private readonly authService : AuthenticationService, private readonly activatedRoute : ActivatedRoute) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        if(error instanceof HttpErrorResponse){
          if(error.status == 401){
            if(request.url !== Endpoints.Auth+"login/"){
              this.messageService.add({severity: "error", detail: "Please login", summary: "Login required"})
              this.router.navigate(['/auth']);
            }
          }else if(error.status == 403){
            if(request.url.toString() !== Endpoints.Cart){
              this.authService.logout();
              this.messageService.add({severity: "error", detail: "Please login", summary: "Login required"})
            }
          }
        }
        console.warn(
          'the interceptor has caught an error, process it here',
          error
        );
        return throwError(() => error);
      })
    );
  }
}
