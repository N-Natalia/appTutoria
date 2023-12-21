import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-datos-tutor',
  templateUrl: './datos-tutor.component.html',
  styleUrls: ['./datos-tutor.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    }
  ]
})
export class DatosTutorComponent {
  codeTutor            : string = "";
  tutor!               : Tutor;

  formDatosTutorUpdate: FormGroup = this.fb.group({
    
    nroCelular_tutor        : ['',[Validators.minLength(9)]],
    lugar_reunion           : [''],
    enlace_reunion          : [''] 
  });

  constructor(private fb                    : FormBuilder,
              private authService           : AuthService,
              private confAcademicaService  : ConfiguracionAcademicaService,
              private messageService        : MessageService){}
  ngOnInit(): void {

    this.codeTutor = this.authService.getCodeFromToken();
    this.confAcademicaService.tutorGET(this.codeTutor)
        .then(tutor =>{
          this.tutor = tutor;
          this.formDatosTutorUpdate.patchValue({
            nroCelular_tutor        : this.tutor.nroCelular,
            lugar_reunion           : this.tutor.lugarReunion,
            enlace_reunion          : this.tutor.enlaceReunion             
            
          });
        })
    
  }

  onSubmit(){
    if(this.formDatosTutorUpdate.valid)
    {
      
      const {nroCelular_tutor, lugar_reunion,enlace_reunion} = this.formDatosTutorUpdate.value; 

      //Actualizar datos de tutorado
   

      let tutorUpdate = new Tutor();
      tutorUpdate.code              = this.tutor.code;
      tutorUpdate.nombres           = this.tutor.nombres;
      tutorUpdate.apPaterno         = this.tutor.apPaterno;
      tutorUpdate.apMaterno         = this.tutor.apMaterno;
      tutorUpdate.email             = this.tutor.email;
      tutorUpdate.nroCelular        = nroCelular_tutor != "" ? parseInt(nroCelular_tutor, 10) : this.tutor.nroCelular == 0 || null ? 0 : this.tutor.nroCelular;
      tutorUpdate.lugarReunion      = lugar_reunion != "" ? lugar_reunion : this.tutor.lugarReunion == "" || null ? "" : this.tutor.lugarReunion;
      tutorUpdate.enlaceReunion     = enlace_reunion != "" ? enlace_reunion : this.tutor.enlaceReunion == "" || null ? "" : this.tutor.enlaceReunion;
      
      //Actualizar tutorado
      this.confAcademicaService.tutorPUT(tutorUpdate)
          .then(()=>{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tus datos fueron actualizados con exito!' });
          })
          .catch((error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al actualizar tus datos' });
          });
    }
  }

}
