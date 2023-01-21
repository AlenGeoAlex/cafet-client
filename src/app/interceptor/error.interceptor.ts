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
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import Endpoints from "../constants/Endpoints";
import {AuthenticationService} from "../services/authentication.service";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private readonly router : Router, private readonly messageService : MessageService, private readonly authService : AuthenticationService) {
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
              this.messageService.add({severity: "error", detail: "Session Timed Out, Please login again", summary: "Timeout"})
              this.router.navigate(['/auth']);
            }
          }else if(error.status == 403){
            this.authService.logout();
            this.messageService.add({severity: "error", detail: "Session Timed Out, Please login again", summary: "Timeout"})
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
