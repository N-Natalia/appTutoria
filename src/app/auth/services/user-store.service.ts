import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private code$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();

  }
  public setRoleForStore(role:string){
    this.role$.next(role);
  }
  public getFullNameFromStore(){
    return this.fullName$.asObservable();
  }

  public setFullNameFromStore(fullName: string){
    this.fullName$.next(fullName);

  }

  public getCodeFromStore(){
    return this.code$.asObservable();
  }

  public setCodeFromStore( code: string){
    this.code$.next(code);

  }
  //instalar paquete: npm i @auth0/angular-jwt
  //Para poder descifrar el token
}
