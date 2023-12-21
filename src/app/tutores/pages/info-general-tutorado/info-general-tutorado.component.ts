import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { ConfiguracionAcademicaService, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-info-general-tutorado',
  templateUrl: './info-general-tutorado.component.html',
  styleUrls: ['./info-general-tutorado.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    }
  ]
})
export class InfoGeneralTutoradoComponent implements OnInit {
  tutorado!               : Tutorado;

  formDatosTutoradoUpdate: FormGroup = this.fb.group({
    
    nroCelular_tutorado       : ['',[Validators.minLength(9)]],
    direccion_tutorado        : [''],
    namePersonReferencia      : [''] ,
    nroCelPersonaReferencia   : ['',[Validators.minLength(9)]],
  });

  constructor(private fb                    : FormBuilder,
              private activatedRoute        : ActivatedRoute,
              private confAcademicaService  : ConfiguracionAcademicaService,
              private messageService        : MessageService){}
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id } ) => this.confAcademicaService.tutoradoGET(id) )        
      )
      .subscribe(result => {
        this.tutorado = result; 

        this.formDatosTutoradoUpdate.patchValue({
          nroCelular_tutorado       : this.tutorado.nroCelular,
          direccion_tutorado        : this.tutorado.direccion,
          namePersonReferencia      : this.tutorado.personReferencia ,
          nroCelPersonaReferencia   : this.tutorado.nroCelularPersonaReferencia
          
        });
      })
  }

  onSubmit(){
    if(this.formDatosTutoradoUpdate.valid)
    {
      
      const {nroCelular_tutorado, direccion_tutorado,namePersonReferencia,nroCelPersonaReferencia} = this.formDatosTutoradoUpdate.value; 

      //Actualizar datos de tutorado
   
      let turadoUpdate = new Tutorado();
      turadoUpdate.code                           = this.tutorado.code;
      turadoUpdate.nombres                        = this.tutorado.nombres;
      turadoUpdate.apPaterno                      = this.tutorado.apPaterno;
      turadoUpdate.apMaterno                      = this.tutorado.apMaterno;
      turadoUpdate.email                          = this.tutorado.email;
      turadoUpdate.nroCelular                     = nroCelular_tutorado != "" ? parseInt(nroCelular_tutorado, 10) : this.tutorado.nroCelular == 0 || null ? 0 : this.tutorado.nroCelular;
      turadoUpdate.direccion                      = direccion_tutorado != "" ? direccion_tutorado : this.tutorado.direccion == "" || null ? "" : this.tutorado.direccion;
      turadoUpdate.personReferencia               = namePersonReferencia != "" ? namePersonReferencia : this.tutorado.personReferencia == "" || null ? "" : this.tutorado.personReferencia;
      turadoUpdate.nroCelularPersonaReferencia    = nroCelPersonaReferencia != "" ? parseInt(nroCelPersonaReferencia, 10) : this.tutorado.nroCelularPersonaReferencia == 0 || null ? 0 : this.tutorado.nroCelularPersonaReferencia;
      //Actualizar tutorado
      this.confAcademicaService.tutoradoPUT(turadoUpdate)
          .then(()=>{            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Datos del tutorado fueron actualizados con exito!' });            
            
          })
          .catch((error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al actualizar datos del tutorado' });
          });
    }
  }
  retroceder(){
    this.messageService.clear(); // Limpiar mensajes antes de retroceder
    window.history.back();
  }

}
