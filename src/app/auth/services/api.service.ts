import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor( private http: HttpClient) { }

  getUsers(){
    return this.http.get<Usuario[]>(`${ this.baseUrl }/User`);
  }
  
}
