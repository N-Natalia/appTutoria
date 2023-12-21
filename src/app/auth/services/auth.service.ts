import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;
  private userPayload: any;

  get usuario(){
    return {...this._usuario};
  }

  constructor( private http: HttpClient) {
  }

  
  login(code: string, password: string){
    const url = `${ this.baseUrl }/User/login`;
    const body = {code, password};

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( (resp) => {
          if( resp.ok ){
            localStorage.setItem('token',resp.token!)
          }
        }),
        map( resp => resp.ok ),
        catchError(err => of(err.err.msg))
        
      );
  }

  register(code: string, email: string,password: string,role:string){
    
    const url = `${ this.baseUrl }/User/register`;
    const body = {code, email, password, role};
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( ({ok, token}) => {
          if(ok){
            localStorage.setItem('token',token!);
          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.err.msg))
      );
    
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token',tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }

  signOut(){
    localStorage.clear();
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getRoleFromToken(){
    this.userPayload = this.decodedToken();    
    
    if(this.userPayload)
    return this.userPayload.role;
  }

 
  getCodeFromToken(){
    this.userPayload = this.decodedToken();
    
    if(this.userPayload)
    return this.userPayload.nameid;
  }
}
