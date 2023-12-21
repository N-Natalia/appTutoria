import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfiguracionAcademicaService, RequestCargaDto, Semestre, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';
import { ProgramacionReservaObligatoria , ResponseProgramacionReservaObligatoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

interface TipoReunion {
  name: string;
  value: number;
}

@Component({
  selector: 'app-nueva-tutoria-obligatoria',
  templateUrl: './nueva-tutoria-obligatoria.component.html',
  styleUrls: ['./nueva-tutoria-obligatoria.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class NuevaTutoriaObligatoriaComponent implements OnInit{

  CargasActivas         : RequestCargaDto[] = [];
  ListaTutores          : Tutor[] = [];
  fechaEnTiempoReal     : Date = new Date();
  tiposReunion          : TipoReunion[] = [
                                  { name: 'Presencial',value: 0 },
                                  { name: 'Virtual', value: 1}
                                ];
  opcionsTotalBloques: any[] = [
    { value: '1' },
    { value: '2'}
  ];
  
  semestre!               : Semestre;  
  ProgramacionActiva!     : ResponseProgramacionReservaObligatoriaDto;
  

  formSesionTutoriaObligatoria: FormGroup = this.fb.group({
    fechaInicio         : ['', [Validators.required]],
    fechaFin            : ['', [Validators.required]],
    selectedTipoReunion : ['Presencial',[Validators.required]]
  });

  constructor(private fb                            : FormBuilder,              
              private messageService                : MessageService,
              private confAcademicaService          : ConfiguracionAcademicaService,
              private sesionTutoriaAcademicaService : SesionTutoriaService){    
  }

  ngOnInit(): void {


    // Recuperar lista de tutores activos 
    this.confAcademicaService.listaActivosCargaTutoria()
      .then(cargasActivas => {
        this.CargasActivas = cargasActivas;
        // console.log( this.CargasActivas)
        let promises = this.CargasActivas.map((carga) => {
          return this.confAcademicaService.tutorGET(carga.idTutor!)
            .then(tutor => {
              // buscar si el tutor ya existe en la lista
              const existe = this.ListaTutores.find(tutor => tutor.code === carga.idTutor);
              if (!existe) {
                this.ListaTutores.push(tutor);
              }              
            })
        });

      // Cuando todas las promesas se resuelvan
      Promise.all(promises).then(() => {
        //Recuperar programacion activa del primer docente. Si existe
        if(this.ListaTutores.length > 0) {
          this.sesionTutoriaAcademicaService.programacionActivoByCodeTutor(this.ListaTutores[0].code!)
          .then(programacionExistente=>{
            this.ProgramacionActiva = programacionExistente;

            console.log(this.ProgramacionActiva.fechaFin);
            const fechaActual = new Date();
            this.fechaEnTiempoReal = fechaActual;

            // Agregar un dia mas a la fecha de la reserva, para desactivar la reserva si ya paso un dia
            let fecha = new Date(this.ProgramacionActiva.fechaFin!);
            fecha.setDate(fecha.getDate()+1);

            // Establecer la hora de las dos fechas a 00:00:00
            this.fechaEnTiempoReal.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);
                                          
            if(this.fechaEnTiempoReal.getTime() > fecha.getTime()){
              //Desactivar programacion activa para cada tutor
              this.ListaTutores.forEach((tutorObj)=>{
                // Buscar programacion de tutor Obj
                this.sesionTutoriaAcademicaService.programacionActivoByCodeTutor(tutorObj.code!)
                  .then((programacionTutorObj)=>{
                    // Desactivar detalle si existen
                    this.sesionTutoriaAcademicaService.desactivarDetalleProgramacionByIdProgramacion(programacionTutorObj.idProgramacion!)
                        .then(()=>{})
                        .catch((err)=>{})
                      
                  })
                
                // Desactivar programacion
                this.sesionTutoriaAcademicaService.desactivarProgramacionByCodeTutor(tutorObj.code!)
                    .then(()=>{})
                    .catch((err)=>{})
                
              })
            }
            
          })
          .catch((err)=>{
            console.log("No se encontró programación activa");
          })
        }

      });
    })

    // Recuperar semestre activo
    this.confAcademicaService.semestreActivo()
        .then(objSemestre =>{
          this.semestre = objSemestre;
        });
    
  } 
  guardar(){ 
    if(this.formSesionTutoriaObligatoria.valid){

      const {fechaInicio,fechaFin,selectedTipoReunion} = this.formSesionTutoriaObligatoria.value;
      
      if(fechaInicio>fechaFin){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de inicio debe ser anterior a la fecha fin. Intentelo nuevamente.' });
        return;
      }

      //Crear el objedo requestprogramacion
      let programacionGuardar = new ProgramacionReservaObligatoria();
      //programacionGuardar.idTutor = this.codeTutor;
      programacionGuardar.duracion = 10;    
      programacionGuardar.totalBloques = 1;
      programacionGuardar.tipo = selectedTipoReunion.value;
      programacionGuardar.fechaInicio = fechaInicio;
      programacionGuardar.fechaFin = fechaFin;
      programacionGuardar.activo = true;

      console.log(programacionGuardar);
      
      
      let exito:boolean = false;

      //Agregar programacion para cada docente
      let promises = this.ListaTutores.map((tutorObj)=>{
        programacionGuardar.idTutor = tutorObj.code!;

        //Registrar programacion de tutoria blogatoria
        return this.sesionTutoriaAcademicaService.programacionReservaObligatoriaPOST(programacionGuardar)
            .then(()=>{
              exito = true;
              console.log("Programacion guardado con éxito");
            })
            .catch((error)=>{              
              console.log("Ocurrio algun error al guardar la programación.");
            })
        
      })

      Promise.all(promises).then(() => {
        if(exito==true){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La programación fue agregado con exito!' });

          //Recargar pagina
          setTimeout(() => {
            window.location.reload(); 
          }, 2000);  
        }
      });
    }   
  }

}
