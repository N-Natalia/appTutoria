import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';
import { SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';


@Component({
  selector: 'app-informacion-tutor',
  templateUrl: './informacion-tutor.component.html',
  styleUrls: ['./informacion-tutor.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class InformacionTutorComponent {
  codeTutorado : string = "";
  codeTutor    : string = "";
  tutor!       : Tutor;
  camposTutor  : any[] = [];

  //Labels de campos de tutor
  labels        : string[] = ["Nombre","Apellidos","Email","Numero de celular"]
  valueApellido : string = "";

  constructor( private authService        : AuthService,
    private confTutoriaAcademica: ConfiguracionAcademicaService ){}

  ngOnInit(): void {   
    
    // Recuperar codigo de tutorado.
    this.codeTutorado = this.authService.getCodeFromToken();

    //Recuperar informacion de tutor
    this.confTutoriaAcademica.codeTutorByCodeTutoradoCargaTutoria(this.codeTutorado)
        .then(resp =>{     
          this.codeTutor = resp.codeTutor!;
          this.confTutoriaAcademica.tutorGET(this.codeTutor)
              .then(tutor =>{               
                this.tutor = tutor;
                this.valueApellido = tutor.apPaterno +" "+ tutor.apMaterno;
     
              })

        })     
  }

}
