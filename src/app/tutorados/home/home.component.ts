import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    }
  ]
})
export class HomeComponent implements OnInit{
  
  menuItems: MenuItem[] = [];//items sidebar menu
  items: any[] = []; //items memu fixed
  
  public nombreCompleto: string = "";
  codeTutorado: string = "";

  constructor(
            private router: Router,
            private authService: AuthService,
            private confTutoriaAcademica: ConfiguracionAcademicaService){}

    ngOnInit() {
        this.menuItems = [       
                                
            {
                label: 'Sesión voluntaria',
                icon: 'pi pi-plus-circle',
                command: () => {this.reservaVoluntaria(); }
            },
            {            
                label: 'Sesión obligatoria',
                icon: 'pi pi-table',
                command: () => {this.reservaObligatoria(); }    
            },
            {            
                label: 'Mi historial',
                icon: 'pi pi-book',
                command: () => {this.historial(); }    
            },
            { 
                label: 'Mi tutor',
                icon: 'pi pi-user',
                command: () => {this.miTutor(); }
            }
        ];

        this.items= [
            { label: 'Sesión voluntaria', icon: 'pi pi-plus-circle', funcion: () =>this.reservaVoluntaria() },
            { label: 'Sesión obligatoria', icon: 'pi pi-table' , funcion: () =>this.reservaObligatoria()},
            { label: 'Mi historial', icon: 'pi pi-book' , funcion: () =>this.historial()},
            { label: 'Mi tutor', icon: 'pi pi-user' , funcion: () =>this.miTutor()}
        ];

        //Obtener cogidp de tutorado
        this.codeTutorado = this.authService.getCodeFromToken();
        //Obtener tutorado
        this.confTutoriaAcademica.tutoradoGET(this.codeTutorado)
            .then(tutorado =>{
                this.nombreCompleto = tutorado.nombres +" " + tutorado.apPaterno + " "+tutorado.apMaterno;
            })
    }

    reservaVoluntaria() {
        this.router.navigate(['tutorados/reservaVoluntaria']);
    }

    reservaObligatoria() {
        this.router.navigate(['tutorados/reservaObligatoria']);
    }
    historial() {
        this.router.navigate(['tutorados/historial']);
    }

    miTutor(){
        this.router.navigate(['tutorados/infoTutor']);
    }

}
