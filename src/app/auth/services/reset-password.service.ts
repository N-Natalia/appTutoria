import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResetPassword } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient) { 
    
  } 

  sendResetPasswordLink(email: string){
    const url = `${ this.baseUrl }/User/send-reset-email/${email}`;
    return this.http.post<any>(url, {});
  }

  resetPassword(resetPasswordObj: ResetPassword){
    const url = `${ this.baseUrl }/User/reset-password`;
    return this.http.post<any>(url, resetPasswordObj);    
  }

}
