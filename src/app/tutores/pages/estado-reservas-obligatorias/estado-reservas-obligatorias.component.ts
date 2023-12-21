import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, RequestCargaDto, ResponseListCodeTutoradosByCodeTutorDto, Tutor, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { ResponseDetalleProgramacionDto, ResponseProgramacionReservaObligatoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

interface ProgramacionMostrar {
  IdProgramacion          :   number;
  IdTutor                 :   string;
  Fecha                   :   Date;
  HoraInicio              :   Date;
  HoraIntervalo           :   string;
  Duracion                :   number;
  Tipo                    :   string;
  EstadoReserva           :   boolean; 
  Atendido                :   boolean;
  NombreTutorado          :   string;
  codeTutorado            :   string;
}

@Component({
  selector: 'app-estado-reservas-obligatorias',
  templateUrl: './estado-reservas-obligatorias.component.html',
  styleUrls: ['./estado-reservas-obligatorias.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class EstadoReservasObligatoriasComponent implements OnInit {

  codeTutor               :string = "";
  tutor!                  : Tutor;
  tutorado!               : Tutorado;
  programacionActivo!     : ResponseProgramacionReservaObligatoriaDto;
  detalleActivo!          : ResponseDetalleProgramacionDto;
  nroBloque               : number = 0;
  codeTutorados           : ResponseListCodeTutoradosByCodeTutorDto[] = [];
  totalNroTutorados       : number = 0;
  programacionMostrar     : ProgramacionMostrar[] = [];
  semestreDenominacion    : string = "";

  CargasActivas         : RequestCargaDto[] = [];
  ListaTutores          : Tutor[] = [];
  fechaEnTiempoReal     : Date = new Date();
  
  constructor(
    private authService                   : AuthService,
    private confAcademicaService          : ConfiguracionAcademicaService,
    private sesionTutoriaAcademicaService : SesionTutoriaService,
    private confirmationService           : ConfirmationService,
    private messageService                : MessageService
  ){}

  

  ngOnInit(): void {
    //Recuperar codigo de tutor
    this.codeTutor = this.authService.getCodeFromToken();
    // Recuperar informacion de tutor
    this.confAcademicaService.tutorGET(this.codeTutor)
        .then(tutor => {
          this.tutor = tutor;
        })

    // Recuperar semestre
    this.confAcademicaService.semestreActivo()
        .then(resp =>{
          this.semestreDenominacion = resp.denominacionSemestre;
        })
    //Recuperara programacion de reserva obligatoria activo

    this.sesionTutoriaAcademicaService.programacionActivoByCodeTutor(this.codeTutor)
        .then(programacion =>{
          this.programacionActivo = programacion;

          //=====================================================================
          // Desactivar programacionesActivos si las fechas caducaron
          // Recuperar lista de tutores activos 
          let fecha = new Date(this.programacionActivo.fechaFin!);
          this.fechaEnTiempoReal = fecha;
          fecha.setDate(fecha.getDate());

          // Establecer la hora de las dos fechas a 00:00:00
          this.fechaEnTiempoReal.setHours(0, 0, 0, 0);
          fecha.setHours(0, 0, 0, 0);

          if(this.fechaEnTiempoReal.getTime() > fecha.getTime()){
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
                    if(this.ListaTutores.length > 0) {
                      
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
              })
          }
          //=====================================================================

          //Recuperar el total de bloques
          this.sesionTutoriaAcademicaService.detallesProgramacionByIdProgramacion(this.programacionActivo.idProgramacion!)
              .then(detallesProgramacion =>{
                this.nroBloque = detallesProgramacion.length;
              })
              .catch((err)=>{
                console.log("Ocurrio algun error al recuperar los detalles de la programacion");
                
              })
            
          //Busccar detalle activo de programacion activo
          this.sesionTutoriaAcademicaService.detalleProgramacionActivoByIdProgramacion(this.programacionActivo.idProgramacion!)
              .then(detalleActivo=>{
                this.detalleActivo = detalleActivo;

                //Recuperar lista de tutorados de tutor
                this.confAcademicaService.codeTutoradosByCodeTutorCargaTutoria(this.codeTutor)
                .then(codeTutorados =>{
                  this.codeTutorados = codeTutorados;
                  this.totalNroTutorados = codeTutorados.length;

                  // Construir lista programacion mostrar
                  
                  if(this.programacionActivo && this.detalleActivo){
                    
                    //Recuperar reservas realizadas con dicha programacion
                    this.sesionTutoriaAcademicaService.reservasByIdProgramacion(this.programacionActivo.idProgramacion!)
                        .then(reservas =>{

                          let horaInicio = this.convertirHoraString_Date(this.detalleActivo.horaInicioSesionTutoria!);
                          // iterar hasta el total de cantidad de estudiantes
                          for (let i = 0; i < this.totalNroTutorados; i++) {
                            
                            // Buscar si existe reserva by idProgramacion y by hora
                            let reservaExistente = reservas.find(reserva => 
                              reserva.idProgramacionReservaObligatoria == this.programacionActivo.idProgramacion && 
                              reserva.horaTutoria == this.obtenerHoraStringDeHoraDate(horaInicio) );

                            const horaFin = new Date(horaInicio);    
                            horaFin.setMinutes(horaFin.getMinutes() + this.programacionActivo.duracion!);

                            // Crear objeto
                            let programacionMostrarObj = {
                              HoraInicio: horaInicio,
                              HoraIntervalo: this.formatHora(horaInicio) + ' - ' + this.formatHora(horaFin),
                              EstadoReserva: false, 
                              // Hereda otros atributos de programacionActivo
                              IdProgramacion: this.programacionActivo.idProgramacion!,
                              IdTutor: this.programacionActivo.idTutor!,
                              Duracion: this.programacionActivo.duracion ?? 0,
                              Tipo: this.programacionActivo.tipo!,
                              Fecha: this.detalleActivo.fecha!,
                              Atendido: false,
                              NombreTutorado:"",
                              codeTutorado: ""
                            }
                            if(reservaExistente){
                              this.confAcademicaService.cargaTutoriaGET(reservaExistente.idCargaTutoria!)
                                  .then(carga =>{
                                    //recuperar obj tutorado
                                    this.confAcademicaService.tutoradoGET(carga.idTutorado!)
                                        .then(tutorado => {
                                          this.tutorado=tutorado;
                                          
                                          const nombreTutorado = tutorado.nombres+" "+tutorado.apPaterno+" "+tutorado.apMaterno;
                                          programacionMostrarObj.EstadoReserva= true,
                                          programacionMostrarObj.NombreTutorado = nombreTutorado;
                                          programacionMostrarObj.codeTutorado = tutorado.code!;
                                        })
                                  }) 
                            }
                            
                            horaInicio = horaFin; // Siguiente intervalo comienza donde termina el actual
        
                            this.programacionMostrar.push(programacionMostrarObj);
                            
                          }   
                        })
                      } 
                    })
                })
              })
              .catch((err)=>{
                console.log("No se encontro ningun detalle de la programacion activa");
                
              })
      
  }

  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  convertirHoraString_Date(hora: string): Date {
    const partesHora = hora.split(":"); // Separar la cadena en partes
    const fecha = new Date(); // Crear un objeto de fecha con la fecha actual
    fecha.setHours(Number(partesHora[0])); // Establecer las horas
    fecha.setMinutes(Number(partesHora[1])); // Establecer los minutos
    fecha.setSeconds(Number(partesHora[2])); // Establecer los segundos
    return fecha;
  }

  obtenerHoraStringDeHoraDate(hora: Date): string {
    const datePipe = new DatePipe('en-US');
    const horaCadena = datePipe.transform(hora, 'HH:mm:ss');
    return horaCadena!;
  }

  formatHora(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? '12' : (hours % 12).toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    return formattedHours + ':' + formattedMinutes + ' ' + ampm;
  }

  
  formatoTiempoConDuracion(hora: Date, duracion: number): string {
    const startTime = new Date(hora);
    const endTime = new Date(hora);
    endTime.setMinutes(endTime.getMinutes() + duracion);
    const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedStartTime} - ${formattedEndTime}`;
  }  


  messageTipoPresencial(Tutorado: Tutorado, fechaSeleccionada: string, hora: Date, duracion: number,salaReunion: string): any {
    // Retornar el contenido HTML como una cadena
    return `
      <table class="bg-blue-100 p-4 ">          
        <tbody>
          <tr class="bg-blue-200">
            <td class=" font-bold">Datos tutorado</td>
          </tr>
          <tr>
            <td class="font-bold">Código</td>
            <td>:</td>
            <td>
              <div class="ml-2">
                ${Tutorado.code} 
              </div>          
            </td>
          </tr>
          <tr>
            <td class="font-bold">Nombre</td>
            <td>:</td>
            <td> <div class="ml-2">${Tutorado.nombres}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Apellidos</td>
            <td>:</td>
            <td> <div class="ml-2">${Tutorado.apPaterno} ${Tutorado.apMaterno}</div></td>
          </tr>
          <tr class="bg-blue-200">
            <td class=" font-bold">Datos reserva</td>
          </tr>
          <tr>
            <td class="font-bold">Fecha</td>
            <td>:</td>
            <td> <div class="ml-2">${fechaSeleccionada}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Hora</td>
            <td>:</td>
            <td><div class="ml-2">${this.formatoTiempoConDuracion(hora, duracion)}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Tipo de reunión</td>
            <td>:</td>
            <td> <div class="ml-2">Presencial</div></td>
          </tr>
          <tr>
            <td class="font-bold">Sala de reunión</td>
            <td>:</td>
            <td> <div class="ml-2">${salaReunion}</div></td>       
          </tr>
        </tbody>   
      </table>
    `;
  }

  messageTipoVirtual(Tutorado: Tutorado, fechaSeleccionada: string, hora: Date, duracion: number,enlaceReunion:string): any {
    // Retornar el contenido HTML como una cadena
    return `
      <table class="bg-blue-100 p-4 ">          
        <tbody>
          <tr class="bg-blue-200">
            <td class=" font-bold">Datos tutorado</td>
          </tr>
          <tr>
            <td class="font-bold">Código</td>
            <td>:</td>
            <td>
              <div class="ml-2">
                ${Tutorado.code} 
              </div>          
            </td>
          </tr>
          <tr>
            <td class="font-bold">Nombre</td>
            <td>:</td>
            <td> <div class="ml-2">${Tutorado.nombres}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Apellidos</td>
            <td>:</td>
            <td> <div class="ml-2">${Tutorado.apPaterno} ${Tutorado.apMaterno}</div></td>
          </tr>
          <tr class="bg-blue-200">
            <td class=" font-bold">Datos reserva</td>
          </tr>
          <tr>
            <td class="font-bold">Fecha</td>
            <td>:</td>
            <td> <div class="ml-2">${fechaSeleccionada}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Hora</td>
            <td>:</td>
            <td><div class="ml-2">${this.formatoTiempoConDuracion(hora, duracion)}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Tipo de reunión</td>
            <td>:</td>
            <td> <div class="ml-2">Virtual</div></td>
          </tr>
          <tr>
            <td class="font-bold">Enlace de reunión</td>
            <td>:</td>
            <td>
              <a class="ml-2" href="${enlaceReunion}" target="_blank"> ${enlaceReunion}</a>

            </td>
          </tr>
        </tbody>   
      </table>
    `;
  }
  


  confirm1(programacionMostrarObject: ProgramacionMostrar) {
      // Recuperar objeto tutorado a partir de su codigo
      this.confAcademicaService.tutoradoGET(programacionMostrarObject.codeTutorado).then(
        tutorado => {

          // Definir el mensaje en función del tipo de horario
          let message = '';

          if (programacionMostrarObject.Tipo === 'Virtual') {    
            let enlaceReunion =this.tutor.enlaceReunion;                            
            message = this.messageTipoVirtual(tutorado,this.formatearUTCFecha(programacionMostrarObject.Fecha.toISOString()), programacionMostrarObject.HoraInicio, programacionMostrarObject.Duracion,enlaceReunion!);  
          } else if (programacionMostrarObject.Tipo === 'Presencial') {
            let salaReunion =this.tutor.lugarReunion;
            if(!salaReunion){salaReunion = ""}
            message = this.messageTipoPresencial(tutorado, this.formatearUTCFecha(programacionMostrarObject.Fecha.toISOString()),programacionMostrarObject.HoraInicio, programacionMostrarObject.Duracion,salaReunion);
          }

          this.confirmationService.confirm({
            key:"dialogo1",
            message: message,    
            accept: () => {           
                            
            }
          });
        }              
      ) 
          
  }

  confirm2() {   
    
    this.confirmationService.confirm({
      key:"dialogo2",
      //Message
      message: // Retornar el contenido HTML como una cadena
        `
        <div >Asegúrese que todos sus tutorados fueron atendidos conforme a su plan para este bloque, puesto que al realizar esta acción no podra revertirla.</div>  
      `,                        
      accept: () => {  
        //Desactivar detalle programacion por id tutor
        this.sesionTutoriaAcademicaService.desactivarDetalleProgramacionByIdProgramacion(this.programacionActivo.idProgramacion!) 
            .then(()=>{

              //Desactivar programacion si todos los bloques de dicha programacion fue desactivado
              /* if(this.nroBloque == this.programacionActivo.totalBloques){
                this.sesionTutoriaAcademicaService.desactivarProgramacionByCodeTutor(this.codeTutor)
                    .then(()=>{
                      console.log("La programación fue desactivada exitosamente.");
                    })
                    .catch(()=>{
                      console.log("Ocurrio algun error al desactivar la programcion");
                      
                    })
              } */

              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El bloque de la programación fue desactivada con éxito!' });

              window.location.reload(); 
            })
            .catch((error)=>{
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió algún error al desactivar el bloque de la programación de sesión de tutoría obligatoria' });
            })  
                   
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    })
  }

}
