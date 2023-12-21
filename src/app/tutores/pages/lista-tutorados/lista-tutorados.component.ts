import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-lista-tutorados',
  templateUrl: './lista-tutorados.component.html',
  styleUrls: ['./lista-tutorados.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    }
  ]
})
export class ListaTutoradosComponent implements OnInit {
  tutorados         : Tutorado[]=[];
  codeTutor         :string = "";


  constructor(  private authService           : AuthService,
                private confAcademicaService  : ConfiguracionAcademicaService) { }

  ngOnInit() {
    //Recuperar code tutor
    this.codeTutor = this.authService.getCodeFromToken();

    //Recuperar codeTutorados by codeTutor
    this.confAcademicaService.codeTutoradosByCodeTutorCargaTutoria(this.codeTutor)
        .then(codeTutorados =>{
          codeTutorados.forEach((resp) => {
            this.confAcademicaService.tutoradoGET(resp.idTutorado!)
                .then(tutorado=>{                  
                  this.tutorados.push(tutorado);
                })
          });          
        })
    
      
    

  }

}
