import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, ResponseListCodeTutoradosByCodeTutorDto, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';
import { RequestReservaDto, ResponseDetalleProgramacionDto, ResponseProgramacionReservaObligatoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';
import { Tutorado } from '../../../services/Nswag/configuracion-academica.service';
import { DatePipe } from '@angular/common';


interface ProgramacionMostrar {
  IdProgramacion          :   number;
  IdTutor                 :   string;
  Fecha                   :   Date;
  HoraInicio              :   Date;
  HoraIntervalo           :   string;
  Duracion                :   number;
  Tipo                    :   string;
  EstadoReserva           :   boolean; 
  MiReserva               :   boolean;
}


@Component({
  selector: 'app-reserva-obligatoria',
  templateUrl: './reserva-obligatoria.component.html',
  styleUrls: ['./reserva-obligatoria.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class ReservaObligatoriaComponent implements OnInit{

  codeTutorado         : string = "";
  codeTutor            : string = "";
  programacionActivo!  : ResponseProgramacionReservaObligatoriaDto;
  detalleActivo!       : ResponseDetalleProgramacionDto;
  nroBloque            : number = 0;
  totalTutorados       : number = 0;
  codeTutorados        : ResponseListCodeTutoradosByCodeTutorDto[] = [];
  programacionMostrar  : ProgramacionMostrar[] = [];
  tutorado!            : Tutorado;
  tutor!               : Tutor;
  semestreDenominacion    : string = "";


  constructor(private authService                   : AuthService,
              private confAcademicaService          : ConfiguracionAcademicaService,
              private sesionTutoriaAcademicaService : SesionTutoriaService,
              private confirmationService           : ConfirmationService,
              private messageService                : MessageService){}

  ngOnInit() {
    // Recuperar semestre
    this.confAcademicaService.semestreActivo()
        .then(resp =>{
          this.semestreDenominacion = resp.denominacionSemestre;
        })
    // Recuperar codigo de tutorado.
    this.codeTutorado = this.authService.getCodeFromToken();

    // Recuperar code Tutor by IdTtutorado    
    this.confAcademicaService.codeTutorByCodeTutoradoCargaTutoria(this.codeTutorado)
      .then( x =>
        { 
          this.codeTutor = x.codeTutor!;
          // Recuperar programacion de reserva obligatoria
          this.sesionTutoriaAcademicaService.programacionActivoByCodeTutor(this.codeTutor)
              .then(programacion => {
                  this.programacionActivo = programacion;
                   //Recuperar el total de bloques
                  this.sesionTutoriaAcademicaService.detallesProgramacionByIdProgramacion(this.programacionActivo.idProgramacion!)
                  .then(detallesProgramacion =>{
                    this.nroBloque = detallesProgramacion.length;
                  })
                  .catch((err)=>{
                    console.log("Ocurrio algun error al recuperar los detalles de la programacion");
                    
                  })

                  this.sesionTutoriaAcademicaService.detalleProgramacionActivoByIdProgramacion(this.programacionActivo.idProgramacion!)
                      .then(detalleActivo=>{

                        this.detalleActivo = detalleActivo;
                        // Recuperar code tutorados by code tutor
                        this.confAcademicaService.codeTutoradosByCodeTutorCargaTutoria(this.codeTutor)
                        .then(codeTutorados =>{
                            this.codeTutorados = codeTutorados;                     
                            this.totalTutorados = this.codeTutorados.length;
                            // Contruir list ProgramacionMostrar
                            if (this.programacionActivo && this.detalleActivo) 
                            {
                              // Recuperar reservas realizadas con dicha progracion
                              this.sesionTutoriaAcademicaService.reservasByIdProgramacion(this.programacionActivo.idProgramacion!)
                                  .then(reservas =>
                                    {                                    
                                      // Recuperar carga tutoria del usuario logueado
                                      this.confAcademicaService.idCargaByCodeTutorado(this.codeTutorado)
                                          .then(
                                            resp =>
                                            {
                                              let horaInicio = this.convertirHoraString_Date(this.detalleActivo.horaInicioSesionTutoria!);                          
                                              for (let i = 0; i < this.totalTutorados; i++) {

                                                const horaFin = new Date(horaInicio);
                                                horaFin.setMinutes(horaFin.getMinutes() + this.programacionActivo.duracion!);                            
                                                //Buscar si existe reserva idPorgramacion, hora
                                                let reservaExistente = reservas.find(reserva => reserva.idProgramacionReservaObligatoria == this.programacionActivo.idProgramacion && reserva.horaTutoria == this.obtenerHoraDeHoraDate(horaInicio) );

                                                if(reservaExistente){

                                                  const miReserv =  reservaExistente.idCargaTutoria === resp.idCarga;
                                                  this.programacionMostrar.push({                                                
                                                    HoraInicio: horaInicio,
                                                    HoraIntervalo: this.formatHora(horaInicio) + ' - ' + this.formatHora(horaFin),
                                                    EstadoReserva: true, 
                                                    // Hereda otros atributos de programacionActivo
                                                    IdProgramacion: this.detalleActivo.idProgramacion!,
                                                    IdTutor: this.programacionActivo.idTutor!,
                                                    Duracion: this.programacionActivo.duracion ?? 0,
                                                    Tipo: this.programacionActivo.tipo!,
                                                    Fecha: this.detalleActivo.fecha!,
                                                    MiReserva: miReserv
                                                  });

                                                  
                                                }
                                                else{
                                                  this.programacionMostrar.push({
                                                  
                                                    HoraInicio: horaInicio,
                                                    HoraIntervalo: this.formatHora(horaInicio) + ' - ' + this.formatHora(horaFin),
                                                    EstadoReserva: false, 
                                                    // Hereda otros atributos de programacionActivo
                                                    IdProgramacion: this.detalleActivo.idProgramacion!,
                                                    IdTutor: this.programacionActivo.idTutor!,
                                                    Duracion: this.programacionActivo.duracion ?? 0,
                                                    Tipo: this.programacionActivo.tipo!,
                                                    Fecha: this.detalleActivo.fecha!,
                                                    MiReserva: false
                                                  });
                                                }
                                                horaInicio = horaFin; // Siguiente intervalo comienza donde termina el actual
                                              }
                                            }
                                          )
                                    }
                                  )
                            }
                          })

                      })

                                 
              })
              .catch((err)=>{
                console.log("No se encontro la programación.");
                
              })
        }
      )
  }
  formatHora(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? '12' : (hours % 12).toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    return formattedHours + ':' + formattedMinutes + ' ' + ampm;
  }

  cambiarEstadoReserva(intervalo: any) {
    // Cambiar el estado de reserva del intervalo
    intervalo.estadoReserva = !intervalo.estadoReserva;
  }

  convertirHoraString_Date(hora: string): Date {
    const partesHora = hora.split(":"); // Separar la cadena en partes
    const fecha = new Date(); // Crear un objeto de fecha con la fecha actual
    fecha.setHours(Number(partesHora[0])); // Establecer las horas
    fecha.setMinutes(Number(partesHora[1])); // Establecer los minutos
    fecha.setSeconds(Number(partesHora[2])); // Establecer los segundos
    return fecha;
  }

  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  obtenerHoraDeHoraDate(fecha: Date): string {
    const datePipe = new DatePipe('en-US');
    const horaCadena = datePipe.transform(fecha, 'HH:mm:ss');
    return horaCadena!;
  }
  

  messageTipoPresencial(Tutorado: Tutorado, fechaSeleccionada: string,horaIntervalo: string,tutor: Tutor): any {
    let salaReunion =tutor.lugarReunion;
    if(salaReunion==null){salaReunion = ""}
    // Retornar el contenido HTML como una cadena
    return `
      <table class="pl-4">       
        <tbody>
          <tr class="text-center ">
              <td class="font-bold">Tutor</td>
              <td>:</td>
              <td> <div class="ml-2">${tutor.nombres} ${tutor.apPaterno} ${tutor.apMaterno}</div></td>
            </tr>
        </tbody>   
      </table>
      <br>
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
            <td class="font-bold">Nombres</td>
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
            <td><div class="ml-2">${horaIntervalo}</div></td>
          </tr>
          <tr>
            <td class="font-bold">Tipo de reunión</td>
            <td>:</td>
            <td> <div class="ml-2">Presencial</div></td>
          </tr>
          <tr>
            <td class="font-bold">Lugar de reunión</td>
            <td>:</td>
            <td> <div class="ml-2">${salaReunion}</div></td>       
          </tr>
        </tbody>   
      </table>
    `;
  }


  messageTipoVirtual(Tutorado: Tutorado, fechaSeleccionada: string, horaIntervalo: string,tutor: Tutor): any {
    
    // Retornar el contenido HTML como una cadena
    return `
      <table class="pl-4">       
      <tbody>
        <tr class="text-center ">
            <td class="font-bold">Tutor</td>
            <td>:</td>
            <td> <div class="ml-2">${tutor.nombres} ${tutor.apPaterno} ${tutor.apMaterno}</div></td>
          </tr>
      </tbody>   
      </table>
      <br>
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
            <td class="font-bold">Nombres</td>
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
            <td><div class="ml-2">${horaIntervalo}</div></td>
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
              <a class="ml-2" href="${tutor.enlaceReunion}" target="_blank"> ${tutor.enlaceReunion}</a>
            </td>
          </tr>
        </tbody>   
      </table>
    `;
  }

  confirm1(programacionMostrarObject: ProgramacionMostrar) {
    
      // Recuperar objeto tutorado a partir de su codigo
    this.confAcademicaService.tutoradoGET(this.codeTutorado).then(
      x => {
        this.tutorado = x

        //Recuperar tutor
        // recuperar informacion de tutor: 
        this.confAcademicaService.tutorGET(this.codeTutor)
        .then(tutor=>{
          this.tutor = tutor;

           // Definir el mensaje en función del tipo de horario
           let message = '';

           if (programacionMostrarObject.Tipo === 'Virtual') {                                
             message = this.messageTipoVirtual(this.tutorado,this.formatearUTCFecha(programacionMostrarObject.Fecha.toISOString()), programacionMostrarObject.HoraIntervalo,this.tutor);  
           } else if (programacionMostrarObject.Tipo === 'Presencial') {
             
             message = this.messageTipoPresencial(this.tutorado, this.formatearUTCFecha(programacionMostrarObject.Fecha.toISOString()),programacionMostrarObject.HoraIntervalo,this.tutor);
           }


          this.confirmationService.confirm({
            message: message,
    
            accept: () => {    
              const programacionSeleccionado = this.programacionMostrar.find(horario => horario.HoraInicio==programacionMostrarObject.HoraInicio && horario.HoraIntervalo == programacionMostrarObject.HoraIntervalo);        

  
              if(programacionSeleccionado)
              {
                this.confAcademicaService.idCargaByCodeTutorado(this.codeTutorado)
                .then(carga => {
                             
                  // Crear objeto de tipo  RequestreservaDto
                  let reservaDto = new RequestReservaDto();
                  reservaDto.idCargaTutoria                   = carga.idCarga;
                  reservaDto.idProgramacionReservaObligatoria = programacionMostrarObject.IdProgramacion;
                  reservaDto.idTutorHorarioDisponible         = null!;
                  reservaDto.fecha                            = programacionMostrarObject.Fecha;
                  reservaDto.horaTutoria                      = new Date(programacionMostrarObject.HoraInicio).toTimeString().split(' ')[0];
                  reservaDto.tipoReunion                      = 1;
                  reservaDto.tipoReserva                      = 1;
                  reservaDto.estadoConfirmacion               = 0;
                  reservaDto.enlaceReunion                    = this.tutor.enlaceReunion;
                  reservaDto.lugarReunion                     = null!;
  
                  if(programacionMostrarObject.Tipo == "Presencial"){
                    reservaDto.tipoReunion                      = 0;
                    reservaDto.enlaceReunion                    = null!;
                    reservaDto.lugarReunion                     = this.tutor.lugarReunion;
                  }
  
                  // Guardar objeto en reservas
                  this.sesionTutoriaAcademicaService.reservaPOST(reservaDto)
                      .then(()=>{
  
                        // Actualiza el valor de ReservaRealizada a true
                        programacionSeleccionado.MiReserva = true;
                        programacionSeleccionado.EstadoReserva = true;
                        //programacionSeleccionado.EstadoReserva = true;
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tu reserva fue realizado con exito!' });
  
                      })
                      .catch((error) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al realizar la reserva' });
                      });
                    
                }) 
              }               
            },
            reject: (type: ConfirmEventType) => {
              switch (type) {
                case ConfirmEventType.REJECT:
                  // recuperar programacion seleccionado
                  const programacionSeleccionado = this.programacionMostrar.find(horario => horario.HoraInicio==programacionMostrarObject.HoraInicio && horario.HoraIntervalo == programacionMostrarObject.HoraIntervalo);           
  
                  if(programacionSeleccionado)
                  {
                    this.sesionTutoriaAcademicaService.reservasByIdProgramacion(this.programacionActivo.idProgramacion!)
                        .then(reservas =>{
                          // Recuperar id carga de tutorado
                          this.confAcademicaService.idCargaByCodeTutorado(this.codeTutorado)
                              .then(resp =>{
                                
                                //Buscar si existe reserva idPorgramacion, hora
                                let reservaExistente = reservas.find(reserva => reserva.idProgramacionReservaObligatoria == this.programacionActivo.idProgramacion && reserva.idCargaTutoria == resp.idCarga );
  
                                // Eliminar reserva
                                if(reservaExistente && reservaExistente.idCargaTutoria == resp.idCarga && reservaExistente.horaTutoria == this.obtenerHoraDeHoraDate(programacionSeleccionado.HoraInicio)){
                                  this.sesionTutoriaAcademicaService.reservaDELETE(reservaExistente.idReserva!)
                                      .then(() => {   
                                        // Cambiar el estado de reserva, y miReserva
                                        programacionSeleccionado.EstadoReserva = false;
                                        programacionSeleccionado.MiReserva = false;
  
                                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tu reserva fue cancelado con exito!' });
  
                                      })
                                      .catch((error)=>{
                                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al cancelar la reserva' });
                                      })
                                }   
                              })                       
                        })
                  }
             
                  break;
                case ConfirmEventType.CANCEL:
                  break;
              }
            }
          });
        })        
      }              
    )   
  
  }
}
