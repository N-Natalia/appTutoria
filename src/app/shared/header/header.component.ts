import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent { 
  @Input() actor: string = "";

  constructor(private router: Router,
              private authService: AuthService){}

  logOut(){
    this.authService.signOut();
    this.router.navigate(['home']);    
  }

}
