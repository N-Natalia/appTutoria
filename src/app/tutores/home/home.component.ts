import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService } from 'src/app/services/Nswag/configuracion-academica.service';

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
      
    menuItems: MenuItem[] = [];
    items: any[] = [];
    
    public nombreCompleto: string = "";
    codeTutor: string = "";

    constructor(private router: Router,
                private authService: AuthService,
                private confTutoriaAcademica: ConfiguracionAcademicaService){
    
    }

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Estado reservas voluntarias',
                icon: 'pi pi-refresh',
                command: () => {
                    this.reservasVoluntarias();
                }
            },
            {
                label: 'Registrar horario disponible',
                icon: 'pi pi-calendar-plus',
                command: () => {
                    this.registrarHorario();
                }
            },
            {
                label: 'Nueva sesión obligatoria',
                icon: 'pi pi-plus-circle',
                command: () => {
                    this.nuevaSesionObligatoria();
                }
            },
            {
                label: 'Estado sesión obligatoria',
                icon: 'pi pi-refresh',
                command: () => {
                    this.estadoSesionTutoriaObligatoria();
                }
            },
            {
                label: 'Mis tutorados',
                icon: 'pi pi-users',
                command: () => {
                    this.listaTutorados();
                }
            },
            {
                label: 'Mis datos',
                icon: 'pi pi-user',
                command: () => {
                    this.datoTutor();
                }
            }
        ];

        this.items= [
            { label: 'Reservas voluntarias', icon: 'pi pi-refresh', funcion: () =>this.reservasVoluntarias()  },
            { label: 'Registrar horario', icon: 'pi pi-calendar-plus', funcion: () =>this.registrarHorario() },
            { label: 'Nueva sesión obligatoria', icon: 'pi pi-plus-circle', funcion: () =>this.nuevaSesionObligatoria() },
            { label: 'Estado sesión obligatoria', icon: 'pi pi-refresh', funcion: () =>this.estadoSesionTutoriaObligatoria() },
            { label: 'Tutorados', icon: 'pi pi-users', funcion: () =>this.listaTutorados() },
            { label: 'Mis datos', icon: 'pi pi-user', funcion: () =>this.datoTutor() }
          ];
        
        //Obtener cogido de tutor
        this.codeTutor = this.authService.getCodeFromToken();
        //Obtener tutor
        this.confTutoriaAcademica.tutorGET(this.codeTutor)
            .then(tutor =>{
                this.nombreCompleto = tutor.nombres +" " + tutor.apPaterno + " "+tutor.apMaterno;
            })
        

    }

    reservasVoluntarias() {
        this.router.navigate(['tutores/estadoReservasVoluntarias']);
    }
    registrarHorario(){
        this.router.navigate(['tutores/registrarHorarioDisponible']);
    }

    nuevaSesionObligatoria() {
        this.router.navigate(['tutores/newSesionTutoriaObligatoria']);
    }
    
    estadoSesionTutoriaObligatoria(){
        this.router.navigate(['tutores/estadoReservasObligatorias']);
    }

    listaTutorados(){
        this.router.navigate(['tutores/listaTutorados']);
    }
    datoTutor(){
        this.router.navigate(['tutores/datosTutor']);
    }

}
