import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = this.authService.getToken();

    if(myToken){
      //modificar solicitud
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      })
    }

    return next.handle(request).pipe(
      catchError((err:any) => {
        if( err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El token expiro, por favor, inicie sesion nuevamente!!' });
            this.router.navigateByUrl("auth/login");

          }
        }
        return throwError(()=> new Error("Algunos otros errores ocurrieron"))

      })
      
    );
  }
}
