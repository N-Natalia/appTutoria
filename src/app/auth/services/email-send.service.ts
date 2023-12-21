import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailSendService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient) { 
    
  } 

  sendReservaNotificationEmail(email: string){
    const url = `${ this.baseUrl }/User/send-reserva-notificacion-email/${email}`;
    return this.http.post<any>(url, {});
  }
  sendProgramacionTutoriaObligatoriaNotificationEmail(email: string){
    const url = `${ this.baseUrl }/User/send-programacion-obligatoria-notificacion-email/${email}`;
    return this.http.post<any>(url, {});
  }
  sendConfirmacionReservaNotificationEmail(email: string){
    const url = `${ this.baseUrl }/User/send-confirmation-reserva-notificacion-email/${email}`;
    return this.http.post<any>(url, {});
  }
}
