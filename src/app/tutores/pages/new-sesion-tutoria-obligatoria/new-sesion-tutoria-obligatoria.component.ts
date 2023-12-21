import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfiguracionAcademicaService, ResponseListCodeTutoradosByCodeTutorDto, Semestre } from 'src/app/services/Nswag/configuracion-academica.service';
import { ProgramacionReservaObligatoria, RequestDetalleProgramacionDto, ResponseDetalleProgramacionDto, ResponseProgramacionReservaObligatoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';
import { DatePipe } from '@angular/common';
import { EmailSendService } from 'src/app/auth/services/email-send.service';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
  selector: 'app-new-sesion-tutoria-obligatoria',
  templateUrl: './new-sesion-tutoria-obligatoria.component.html',
  styleUrls: ['./new-sesion-tutoria-obligatoria.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class NewSesionTutoriaObligatoriaComponent implements OnInit{

  
  opcionsTotalBloques: any[] = [
    { value: 1 },
    { value: 2}
  ];

  codeTutor!              : string;
  cantidadTutorados       : number | undefined;
  ListaCodeTutorados      : ResponseListCodeTutoradosByCodeTutorDto[] = [];
  semestre!               : Semestre;
  mostrarVistaPrevia      :boolean = false;
  actualizadoProgramacion      :boolean = false;
  ProgramacionActiva!     : ResponseProgramacionReservaObligatoriaDto;
  detalleProgramacionActiva!:ResponseDetalleProgramacionDto;
  totalDetallesExistentes : number = 0;

  fechaProgramacionActivaString :string="";
  fechaProgramacionActivaDate! :Date;
  invalidDates: Date[]=[];
  start! : Date;
  end!: Date;

  vistaPreviaData: any;

  formSesionTutoriaObligatoria: FormGroup = this.fb.group({
    intervaloDuracion   : [ ,[Validators.required]],
    totalBloques        : [,[Validators.required]] 
  });

  formDetalleSesionTutoriaObligatoria: FormGroup = this.fb.group({
    fecha               : ['', [Validators.required]],
    horaInicio          : ['',[Validators.required]]
  });
  constructor(private fb                            : FormBuilder,              
              private messageService                : MessageService,
              private authService                   : AuthService,
              private confAcademicaService          : ConfiguracionAcademicaService,
              private sesionTutoriaAcademicaService : SesionTutoriaService,
              private emailSendService              : EmailSendService ){    
  }

  ngOnInit(): void {

    // Recuperar code tutor
    this.codeTutor = this.authService.getCodeFromToken();

    //Recuperar programacion activa. Si existe
    this.sesionTutoriaAcademicaService.programacionActivoByCodeTutor(this.codeTutor)
        .then(programacionExistente=>{
          this.ProgramacionActiva = programacionExistente;

          
          this.formSesionTutoriaObligatoria.patchValue({
            intervaloDuracion       :  this.ProgramacionActiva.duracion,
            totalBloques            :  this.ProgramacionActiva.totalBloques
          });


          //Recuperar cantidad de detalles generados
          this.sesionTutoriaAcademicaService.detallesProgramacionByIdProgramacion(this.ProgramacionActiva.idProgramacion!)
              .then(detallesExistentes =>{
                this.totalDetallesExistentes = detallesExistentes.length;
              })

          // Detalle programacion activo
          this.sesionTutoriaAcademicaService.detalleProgramacionActivoByIdProgramacion(this.ProgramacionActiva.idProgramacion!)
              .then(detalleActivo => {
                this.detalleProgramacionActiva = detalleActivo;
              })

          // Recuperar fechas validas para mostrar en el calendario
          let currentDate = new Date();
          this.start = new Date(this.ProgramacionActiva.fechaInicio!);         
          this.end = new Date(this.ProgramacionActiva.fechaFin!);
          this.start.setDate(this.start.getDate()+1); // Fecha de inicio del intervalo habilitado
          this.end.setDate(this.end.getDate() + 1); // Fecha de fin del intervalo habilitado
          
        })
        .catch((err)=>{
          console.log("No se encontro programacion activa.");
          
        })

    // Recuperar semestre activo
    this.confAcademicaService.semestreActivo()
        .then(objSemestre =>{
          this.semestre = objSemestre;
        });
    // Recuperar code de tutorados by code tutor
    this.confAcademicaService.codeTutoradosByCodeTutorCargaTutoria(this.codeTutor)
        .then(listCodes =>{
          this.ListaCodeTutorados = listCodes;
          this.cantidadTutorados = listCodes.length;
        })

    
  } 

  onSubmit() {
    if(this.formDetalleSesionTutoriaObligatoria.valid){
      this.mostrarVistaPrevia = !this.mostrarVistaPrevia;
      const {fecha,horaInicio} = this.formDetalleSesionTutoriaObligatoria.value;

      this.vistaPreviaData = {
        intervaloDuracion     : this.ProgramacionActiva.duracion,
        horaInicio            : horaInicio
      };
      
      
    }
  }  

  
  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  obtenerHoraStringDeHoraDate(hora: Date): string {
    const datePipe = new DatePipe('en-US');
    const horaCadena = datePipe.transform(hora, 'HH:mm:ss');
    return horaCadena!;
  }
  addDayToDate(fecha: Date, numberOfDays: number){
    return new Date(fecha!.setDate(fecha!.getDate() + numberOfDays));
  }
  actualizarProgramacion(){ 
    
    if(this.formSesionTutoriaObligatoria.valid && this.ProgramacionActiva){
      
      const {intervaloDuracion,totalBloques} = this.formSesionTutoriaObligatoria.value;
      
      
      //Crear el objeto requestprogramacion
      let programacionGuardar = new ProgramacionReservaObligatoria();
      programacionGuardar.idProgramacion = this.ProgramacionActiva.idProgramacion;
      programacionGuardar.idTutor = this.codeTutor;
      programacionGuardar.duracion = intervaloDuracion;    
      programacionGuardar.totalBloques = totalBloques.value;
      programacionGuardar.tipo = this.ProgramacionActiva.tipo=='Virtual'? 1:0;
      programacionGuardar.fechaInicio = this.addDayToDate(this.ProgramacionActiva.fechaInicio!, 1);
      programacionGuardar.fechaFin = this.addDayToDate(this.ProgramacionActiva.fechaFin!, 1);
      programacionGuardar.activo = true;
      
      //Agregar objeto creado      
      this.sesionTutoriaAcademicaService.programacionReservaObligatoriaPUT(programacionGuardar)
            .then(()=>{
              this.actualizadoProgramacion = true;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Programación actualizada con exito!' });

              //Recargar pagina
              setTimeout(() => {
                window.location.reload(); 
              }, 2000);  

            })
            .catch((error)=>{
              
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al actualizar la programación.' });
            })                   
    }   
  }


  guardarDetalle(){
    if(this.formDetalleSesionTutoriaObligatoria.valid && this.ProgramacionActiva){
      this.mostrarVistaPrevia = true;
      const {fecha,horaInicio} = this.formDetalleSesionTutoriaObligatoria.value;  

      const stringHora = this.obtenerHoraStringDeHoraDate(horaInicio);  
 

      //Crear el objeto request detalle programacion
      let detalleProgramacionGuardar = new RequestDetalleProgramacionDto();
      detalleProgramacionGuardar.idProgramacion = this.ProgramacionActiva.idProgramacion;
      detalleProgramacionGuardar.nroBloque = this.totalDetallesExistentes+1;    
      detalleProgramacionGuardar.fecha = fecha;
      detalleProgramacionGuardar.horaInicioSesionTutoria = stringHora;
      detalleProgramacionGuardar.activo = true;

      //Agregar objeto creado
      
      this.sesionTutoriaAcademicaService.detalleProgramacionPOST(detalleProgramacionGuardar)
            .then(()=>{

              this.ListaCodeTutorados.map(obj => {
                this.confAcademicaService.tutoradoGET(obj.idTutorado!)
                    .then(tutorado =>{
                      //Enviar email de notificacion
                      this.emailSendService.sendProgramacionTutoriaObligatoriaNotificationEmail(tutorado.email!)
                        .subscribe({
                          next: (res) =>{
                            console.log("Email de notificacion fue enviado con exito.");     
                          },
                          error:(err)=>{
                            console.log("Hubo algun errror al enviar el email de notificación");                                               
                          }
                      })
                    })
              });
              
              
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bloque de atencion de programación agregado con exito!' });

              //Recargar pagina
              setTimeout(() => {
                window.location.reload(); 
              }, 2000);  

              
            })
            .catch((error)=>{
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al agregar el detalle de la programación' });
            })                   
    }   

  }

}
