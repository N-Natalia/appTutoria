import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-acceso-denegado',
  templateUrl: './acceso-denegado.component.html',
  styleUrls: ['./acceso-denegado.component.css']
})
export class AccesoDenegadoComponent {
  constructor(private router: Router,
    private authService: AuthService){}

  logOut(){
  this.authService.signOut();
  this.router.navigate(['home']);    
  }

}
