
import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Tutor, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { RequestReservaByIdHorarioHoraFechaDto, RequestReservaDto, ResponseReservaDto, ResponseTutorHorarioDisponibleDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';
import { EmailSendService } from '../../../auth/services/email-send.service';
import { DatePipe } from '@angular/common';

interface HorarioMostrar {
  IdTutorHorarioDisponible:   number;
  IdTutor                 :   string;
  Hora                    :   Date;
  Duracion                :   number;
  Dia                     :   string;
  Tipo                    :   string;
  Reservado               :   boolean; 
  MiReserva               :   boolean;
  EstadoConfirmacion      :   boolean;
  Activo                  :   boolean;
}

@Component({
  selector: 'app-reserva-voluntaria',
  templateUrl: './reserva-voluntaria.component.html',
  styleUrls: ['./reserva-voluntaria.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
  
})
export class ReservaVoluntariaComponent implements OnInit {

  codeTutorado                      : string = "";
  codeTutor                         : string = "";
  listHorariosDisponibles           : ResponseTutorHorarioDisponibleDto[] = []; 
  Tutorado!                         : Tutorado;
  Tutor!                            : Tutor;
  horarios!                         : any[];
  horariosSinAgrupar!               : HorarioMostrar[];
  horariosSinAgruparCompleto        : HorarioMostrar[][]=[[]];
  diasSemana                        : string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  datosParaMostrar                  : string[] = [];  
  fechaEnTiempoReal                 : Date = new Date();
  fechas                            : Date[] = [];
  emailTutor                        : string = ""; 
  semanaActual                      : number = 0;
  semanasSiguientes                 : number = 2; // Muestra las próximas 2 semanas
  posicionFechaMostrar              : number = 0;
  fechas3SemanasString              : string[][] = [[]];
  fechas3SemanasDate                : Date[][] = [[]];
  ListaReservasEncontradas          : ResponseReservaDto[]=[];
  idCargaTutoria!                   : number;
  reservaVoluntariaActivo!          : ResponseReservaDto;


  constructor(private confAcademicaService  : ConfiguracionAcademicaService,
              private sesionTutoriaService  : SesionTutoriaService,
              private confirmationService   : ConfirmationService, 
              private messageService        : MessageService,
              private authService           : AuthService,
              private emailSendService      : EmailSendService){}

  ngOnInit(): void {

    // Recuperar codigo de tutorado.
    this.codeTutorado = this.authService.getCodeFromToken();

    const fechaActual = new Date();
    this.fechaEnTiempoReal = fechaActual;
        
    //  Fechas para las 3 semanas de tipo string 
    this.fechas3SemanasString = this.calcularFechasParaSemanas();
    // Fechas para mostrar en base a la posicion de la semana : 0 -> semana actual,..-
    this.datosParaMostrar = this.fechas3SemanasString[this.posicionFechaMostrar];
    //  Fechas para las 3 semanas de tipo string 
    this.fechas3SemanasDate =  this.calcularFechasParaSemanasDate();
    
    //  Convertir arreglo de datosparaMostrar en tipo date para realizar la comparación.
    this.fechas = this.datosParaMostrar.map(fecha => {
      let [dia, mes, ano] = fecha.split('/');          
      return new Date(parseInt('20' + ano), parseInt(mes) - 1, parseInt(dia));
    });
    
          
    //  Obtener fechas limites de las semanas para buscar reservas realizadas
    let fechaInicio = this.datosParaMostrar[this.semanaActual];
    let fechaLimite =this.fechas3SemanasString[this.semanasSiguientes][this.datosParaMostrar.length - 1];

    //Obtener dia, mes, año    
    let [diaInicio, mesInicio, anioInicio] = fechaInicio.split('/');
    let [diaLimite, mesLimite, anioLimite] = fechaLimite.split('/');
    let anioInicioCompleto = '20' + anioInicio;
    let anioLimiteCompleto = '20' + anioLimite;

    // Recuperar code Tutor by IdTtutorado    
    this.confAcademicaService.codeTutorByCodeTutoradoCargaTutoria(this.codeTutorado)
      .then( resp =>{ 
        this.codeTutor = resp.codeTutor!;
        // Recuperar tutor horario disponible
        this.sesionTutoriaService.listaHorariosByCodeTutor(this.codeTutor)
          .then( horarios => {

            this.listHorariosDisponibles = horarios;
            // Transformar lista de horarios diponibles a tipo horarios para mostrar  
            this.horarios = this.transformarHorariosDisponibles(); 
            
            // Recuperar reservas realizados por otros usuarios
            this.sesionTutoriaService.reservasPorIntervaloFechaTipoVoluntario(
              parseInt(anioInicioCompleto),parseInt(mesInicio),parseInt(diaInicio),
              parseInt(anioLimiteCompleto),parseInt(mesLimite),parseInt(diaLimite))
                .then(reservasEncontradas => {
                  this.ListaReservasEncontradas = reservasEncontradas;

                  this.confAcademicaService.idCargaByCodeTutorado(this.codeTutorado)
                      .then( resp => {
                        this.idCargaTutoria = resp.idCarga!;

                        // Recuperar reserva voluntaria activa
                        this.sesionTutoriaService.reservaVoluntarioActivoByIdCarga(resp.idCarga!)
                            .then(reservaVoluntariaActiva =>{
                              this.reservaVoluntariaActivo=reservaVoluntariaActiva;
                                                            
                              // Agregar un dia mas a la fecha de la reserva, para desactivar la reserva si ya paso un dia
                              let fecha = new Date(this.reservaVoluntariaActivo.fecha!);
                              fecha.setDate(fecha.getDate() + 1);

                              // Establecer la hora de las dos fechas a 00:00:00
                              this.fechaEnTiempoReal.setHours(0, 0, 0, 0);
                              fecha.setHours(0, 0, 0, 0);

                                                            
                              if(this.fechaEnTiempoReal.getTime() > fecha.getTime()){
                                
                                this.sesionTutoriaService.desactivarReservaVoluntarioByIdCarga(this.reservaVoluntariaActivo.idCargaTutoria!)
                                    .then(()=>{         
                                      this.recargarPagina();                                      
                                    })
                                    .catch(()=>{console.log("Ocurrio algun error al desactivar la reserva vencida.");
                                    })
                              }
                            })
                            .catch((err)=>{
                              console.log("No existe reserva voluntaria activa");
                            })
                      
                        this.horariosSinAgrupar.map(dato => {
                          let reserva = this.ListaReservasEncontradas.find(reserva => reserva.idTutorHorarioDisponible == dato.IdTutorHorarioDisponible);

                          if (reserva) {   
                            
                            const indiceFecha = this.obtenerIndiceFecha(reserva.fecha!);
                            // Verifica si el índice de fecha es válido
                            if (indiceFecha >= 0 && indiceFecha < this.horariosSinAgruparCompleto.length){
                              // Busca el horario dentro del array correspondiente
                              const horarioBasadoFecha = this.horariosSinAgruparCompleto[indiceFecha].find(dato => dato.IdTutorHorarioDisponible == reserva?.idTutorHorarioDisponible);
                              // Verifica si se encontró el horario
                              if (horarioBasadoFecha) {
                                // Realiza las actualizaciones necesarias
                                const miReserv = reserva.idCargaTutoria === resp.idCarga;
                                const estadoConfirm = reserva.estadoConfirmacion === "Solicitado";

                                // Actualiza el elemento en horariosSinAgruparCompleto
                                const indiceHorario = this.horariosSinAgruparCompleto[indiceFecha].indexOf(horarioBasadoFecha);
                                
                                this.horariosSinAgruparCompleto[indiceFecha][indiceHorario] = {
                                  ...horarioBasadoFecha,
                                  Reservado: true,
                                  MiReserva: miReserv,
                                  EstadoConfirmacion: !estadoConfirm
                              , Activo:reserva.activo!};      
                              }
                            }
                          }
                        })
                      })                  
                })
            // ordenar horarios por hora
            this.horarios.sort((a, b) => {
              return a.Hora.getTime() - b.Hora.getTime();
            })
          })        
        })   
  }
  recargarPagina() {
    location.reload();
  }

   //Retorna el indice del array de array de fechas, para maneja
  obtenerIndiceFecha(fecha: Date): number {
    const indiceSemana = this.fechas3SemanasDate.findIndex(semana => semana.some(fechaSemana => this.formatearUTCFecha(fechaSemana.toISOString()) === this.formatearUTCFecha(fecha.toISOString())));
    return indiceSemana;
  }

  // Esta función transforma los horarios disponibles a la estructura de horario mostrar
  transformarHorariosDisponibles(): HorarioMostrar[] {
    const ListHorarioMostrar: HorarioMostrar[] = [];

    this.listHorariosDisponibles.forEach(horario => {
      const hora = this.convertirHoraStringADate(horario.hora!);

      const horarioMostrar: HorarioMostrar = {
        IdTutorHorarioDisponible: horario.idHorario!,
        IdTutor                 : horario.idTutor!,
        Hora                    : hora,
        Duracion                : horario.duracion!,
        Dia                     : horario.dia!,
        Tipo                    : horario.tipo!,
        Reservado               : false,
        MiReserva               : false,
        EstadoConfirmacion      : false,
        Activo                  : false
      };
      
      ListHorarioMostrar.push(horarioMostrar);
    });    
    // Asignar a horarios sin agrupar solo los horarios para una semana cualquiera
    this.horariosSinAgrupar = ListHorarioMostrar;
    // Asignar a cada sub array los horarios de una semana con datos base
    this.horariosSinAgruparCompleto[0] = [...ListHorarioMostrar];
    this.horariosSinAgruparCompleto[1] = [...ListHorarioMostrar];
    this.horariosSinAgruparCompleto[2] = [...ListHorarioMostrar];

    // Agrupa los horarios  por intervalo de hora
    const agruparHorarios: HorarioMostrar[] = [];
    ListHorarioMostrar.forEach(horario => {
      const existHorario = agruparHorarios.find(p => p.Hora.getTime() === horario.Hora.getTime() && p.Duracion === horario.Duracion);
      if (existHorario) {
        existHorario.Dia += `, ${horario.Dia}`;
      } else {
        agruparHorarios.push({ ...horario, Dia: horario.Dia });
      }
    });

    return agruparHorarios;
  }

  convertirHoraStringADate(horaString: string): Date {    
    // Extraer las horas y los minutos del string
    let partes = horaString.split(':');
    let horas = +partes[0];
    let minutos = +partes[1];    
    return new Date(0, 0, 0,horas,minutos);
  }
 
  esDisponible(dia: string, hora: Date): boolean {
    return this.horarios.some(horario => horario.Dia.includes(dia) && horario.Hora === hora);
  }

  
  formatoTiempoConDuracion(hora: Date, duracion: number): string {
    const startTime = new Date(hora);
    const endTime = new Date(hora);
    endTime.setMinutes(endTime.getMinutes() + duracion);
    const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedStartTime} - ${formattedEndTime}`;
  }  

  // Calcular las fechas de las próximas semanas datos de tipo string
  calcularFechasParaSemanas() {
    const fechasPorSemana: string[][] = [];
    const fechaActual = new Date();
  
    for (let i = this.semanaActual; i <= this.semanaActual + this.semanasSiguientes; i++) {
      const fechaInicioSemana = new Date(fechaActual);
      fechaInicioSemana.setDate(fechaInicioSemana.getDate() + i * 7 - fechaInicioSemana.getDay() + 1); // Agregacion del 1 para que comience desde el lunes
      const fechasSemana = [];
  
      for (let j = 0; j < 5; j++) { // Solo de lunes a viernes
        const fechaDia = new Date(fechaInicioSemana);
        fechaDia.setDate(fechaDia.getDate() + j);
        const formattedDate = fechaDia.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: '2-digit' });
        fechasSemana.push(formattedDate);
      }
  
      fechasPorSemana.push(fechasSemana);
    }
  
    return fechasPorSemana;
  }
  // Calcular las fechas de las próximas semanas datos de tipo date
  calcularFechasParaSemanasDate() {
    const fechasPorSemana: Date[][] = [];
    const fechaActual = new Date();
    for (let i = this.semanaActual; i <= this.semanaActual + this.semanasSiguientes; i++) {
      const fechaInicioSemana = new Date(fechaActual);
      fechaInicioSemana.setDate(fechaInicioSemana.getDate() + i * 7 - fechaInicioSemana.getDay()+1);
      const fechasSemana = [];
  
      for (let j = 0; j < 5; j++) { // Solo de lunes a viernes
        const fechaDia = new Date(fechaInicioSemana);
        fechaDia.setDate(fechaDia.getDate() + j);
        fechasSemana.push(fechaDia);
      }
      fechasPorSemana.push(fechasSemana);
    }
    return fechasPorSemana;
  }
  
  
  // Avanzar a la próxima semana
  avanzarSemana() {
    if( this.posicionFechaMostrar<this.semanasSiguientes){
      // Agregar una posicion a posicionFechaMostrar
      this.posicionFechaMostrar++;
      // Actualizar datos para mostrar
      this.datosParaMostrar = this.fechas3SemanasString[this.posicionFechaMostrar];
    }
  }  

  // Retroceder a la semana anterior
  retrocederSemana() {
    if(this.posicionFechaMostrar>0){
      // Disminuir una posicion a posicionFechaMostrar
      this.posicionFechaMostrar--;
      // Actualizar datos para mostrar
      this.datosParaMostrar = this.fechas3SemanasString[this.posicionFechaMostrar];
    }    
  }

  

  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }
  convertirHoraDateACadena(hora: Date): string {
    const datePipe = new DatePipe('en-US');
    const horaCadena = datePipe.transform(hora, 'HH:mm:ss');
    return horaCadena!;
  }
  
  //Devuelve el estado de reserva de un determinado horario de una determinada semana

  horarioNoAgrupadoReservado(dia: string, hora: Date){
    const horarioExistenteNoAgrupado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].find(horario => horario.Dia==dia && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora));    
    return horarioExistenteNoAgrupado?.Reservado;
  }
  //Devuelve el estado de MiReserva de un determinado horario de una determinada semana
  horarioNoAgrupadoMiReserva(dia: string, hora: Date){
    const horarioExistenteNoAgrupado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].find(horario => horario.Dia==dia && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora));
    return horarioExistenteNoAgrupado?.MiReserva;
  }
  //Devuelve el estado de confirmacion de un determinado horario de una determinada semana
  horarioNoAgrupadoEstadoConfirmacion(dia: string, hora: Date){
    const horarioExistenteNoAgrupado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].find(horario => horario.Dia==dia && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora));
    return horarioExistenteNoAgrupado?.EstadoConfirmacion;
  }
  //Devuelve el tipo de reunion de un determinado horario de una determinada semana
  horarioNoAgrupadoTipo(dia: string, hora: Date){
    const horarioExistenteNoAgrupado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].find(horario => horario.Dia==dia && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora));
    return horarioExistenteNoAgrupado?.Tipo;
  }

  textoButtom(dia:string,hora:Date){
    const texto = !this.esDisponible(dia,hora ) ? '' : (this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoMiReserva(dia,hora) && this.esDisponible(dia,hora)) ? 'Reservado'+' ('+this.horarioNoAgrupadoTipo(dia,hora)+')': this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoMiReserva(dia,hora) && this.esDisponible(dia,hora) ? 'Mi reserva': 'Disponible '+' ('+this.horarioNoAgrupadoTipo(dia,hora)+')'
    return texto;
  }

  estadoGreen(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && !this.horarioNoAgrupadoReservado(dia,hora)

  }
  estadoBlue(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoMiReserva(dia,hora);

  }
  estadoSky(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoMiReserva(dia,hora);
  }
  buttomDesabilitado(dia:string,hora:Date,posicion:number){
    return !this.esDisponible(dia,hora) || (this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoMiReserva(dia,hora)) || this.fechas[posicion] <= this.fechaEnTiempoReal && !this.estadoSky(dia,hora) && this.posicionFechaMostrar==0 ;

  }
  checkboxExist(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoMiReserva(dia,hora);
  }


  messageTipoPresencial(Tutorado: Tutorado, fechaSeleccionada: string, hora: Date, duracion: number,tutor: Tutor): any {
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
            <td> <div class="ml-2">${tutor.lugarReunion}</div></td>       
          </tr>
        </tbody>   
      </table>
    `;
  }


  messageTipoVirtual(Tutorado: Tutorado, fechaSeleccionada: string, hora: Date, duracion: number,tutor: Tutor): any {
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
          <tr >
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


  confirm1(diaSemana: string, hora: Date, duracion: number) {
    //Recuperar el indice del dia de la semana
    const fechaIndex = this.diasSemana.indexOf(diaSemana);
    if (fechaIndex !== -1) {
      //Recuperar la fecha seleccionada
      const fechaSeleccionada = this.datosParaMostrar[fechaIndex];
      // Recuperar el indice del subarray del horario especifico seleccionado
      const horarioIndexSeleccionado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].findIndex(horario =>
        horario.Dia == diaSemana && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora)
      );
        
      if(horarioIndexSeleccionado !== -1){

        // Clonar el objeto para evitar modificar una referencia compartida entre los demas subarrays
        const horarioActualizado = { ...this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] };
        // Recuperar objeto tutorado a partir de su codigo
        this.confAcademicaService.tutoradoGET(this.codeTutorado)
        .then(datosTutorado => {
            this.Tutorado = datosTutorado;
            // recuperar informacion de tutor: 
            this.confAcademicaService.tutorGET(this.codeTutor)
                .then(tutor=>{

                  this.Tutor = tutor;
                  // Definir el mensaje en función del tipo de horario
                  let message = '';

                  if (horarioActualizado.Tipo === 'Virtual') {                                
                    message = this.messageTipoVirtual(this.Tutorado,fechaSeleccionada, hora, duracion,this.Tutor);  
                  } else if (horarioActualizado.Tipo === 'Presencial') {
                    let salaReunion =tutor.lugarReunion;
                    if(!salaReunion){salaReunion = ""}
                    message = this.messageTipoPresencial(this.Tutorado, fechaSeleccionada,hora, duracion,this.Tutor);
                  }

                  this.confirmationService.confirm({
                    message: message,            
                    accept: () => { 

                      //Buscar si exite una reserva voluntaria activa, 
                      // solo se puede reservar cuando no exista una reserva activa

                      this.sesionTutoriaService.reservaVoluntarioActivoByIdCarga(this.idCargaTutoria)
                      .then( reservaActivo =>{
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Ud. tiene una reserva activa. Para modificar el horario, simplemente cancele la reserva actual.' });
                       
                        
                      })
                      .catch((err)=>{
                        this.confAcademicaService.idCargaByCodeTutorado(this.Tutorado.code!)
                            .then(carga => {
                              
                              // Recuperar email de tutor
                              this.emailTutor = this.Tutor.email!;                                                        
                              // Hora date -> convertir hora de tipo date a string                        
                              var horaString = this.convertirHoraDateACadena(hora);       
                                                  
                              // Recuperar idTutorHorarioDisponible

                              this.sesionTutoriaService.horarioByCodeTutorFechaHora(tutor.code,diaSemana,horaString)
                                  .then(horario => {
                                    // Convertir fechaSeleccionada en un formato requerido
                                    let [dia, mes, anio] = fechaSeleccionada.split('/');
                                    let fechaConvertido = new Date(parseInt('20' + anio), parseInt(mes) - 1, parseInt(dia));

                                    let reservaDto = new RequestReservaDto();
                                    reservaDto.idCargaTutoria                   = carga.idCarga;
                                    reservaDto.idProgramacionReservaObligatoria = null!;
                                    reservaDto.idTutorHorarioDisponible         = horario.idHorario;
                                    reservaDto.fecha                            = fechaConvertido;
                                    reservaDto.horaTutoria                      = new Date(hora).toTimeString().split(' ')[0];;
                                    reservaDto.tipoReunion                      = 0;
                                    reservaDto.tipoReserva                      = 0;
                                    reservaDto.estadoConfirmacion               = 0;
                                    reservaDto.enlaceReunion                    = null!;
                                    reservaDto.lugarReunion                     = tutor.lugarReunion;
                                    reservaDto.activo                           = true;
                                    
                                                                  
                                    if(horario.tipo == "Virtual"){

                                      reservaDto.tipoReunion                      = 1;
                                      reservaDto.enlaceReunion                    = tutor.enlaceReunion;
                                      reservaDto.lugarReunion                     = null!;   
                                    } 

                                    this.sesionTutoriaService.reservaPOST(reservaDto)
                                      .then(() => {
                                        // Actualizar el estado de reserva a reservado y miReserva como true
                                        horarioActualizado.Reservado = true;
                                        horarioActualizado.MiReserva = true; 
                                        // Actualiza el objeto clonado en la matriz
                                        this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] = horarioActualizado;     
                                        
                                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tu reserva fue realizado con exito!' });

                                        //Enviar email de notificacion
                                        this.emailSendService.sendReservaNotificationEmail(this.emailTutor)
                                            .subscribe(
                                              {
                                                next: (res) =>{
                                                  console.log("Email de notificacion enviado con exito.");     
                                                },
                                                error:(err)=>{
                                                  console.log("Hubo algun error al enviar el email de notificacion");                                                
                                                }
                                      
                                              }       
                                            )
                                        })
                                  })//si                                            
                            })
                      })
                                    
                    },
                    reject: (type: ConfirmEventType) => {
                      switch (type) {
                        case ConfirmEventType.REJECT:     
                          
                          this.confAcademicaService.idCargaByCodeTutorado(datosTutorado.code!)
                            .then(carga => {
                              this.confAcademicaService.tutorGET(this.codeTutor)
                                .then( tutor => {
                                  // asignar objeto tutor
                                  this.Tutor = tutor;
        
                                  // Hora date -> convertir hora de tipo date a string                        
                                  var horaString = this.convertirHoraDateACadena(hora);
                                                            
                                  // Convertir fechaSeleccionada en un formato requerido
                                  let [diaFecha, mes, anio] = fechaSeleccionada.split('/');
                                  let fechaConvertido = new Date(parseInt('20' + anio), parseInt(mes) - 1, parseInt(diaFecha));
                                                    
                                  
                                  // Recuperar idTutorHorarioDisponible
                                  this.sesionTutoriaService.horarioByCodeTutorFechaHora(tutor.code,diaSemana,horaString)
                                      .then(horario => {
        
                                        let requestReserva = new RequestReservaByIdHorarioHoraFechaDto();
                                        requestReserva.idTutorHorarioDisponible = horario.idHorario;
                                        requestReserva.fecha                    = fechaConvertido;
                                        requestReserva.hora                     = horaString;
                                        
                                        this.sesionTutoriaService.reservaByIdHorarioHoraFecha(requestReserva)
                                            .then(reserva => {
                                              if (reserva !== null){
                                                // if( fechaSeleccionada < this.fechaEnTiempoReal)

                                                let [dia, mes, ano] = fechaSeleccionada.split('/');          
                                                const fechaSeleccionadaDate =  new Date(parseInt('20' + ano), parseInt(mes) - 1, parseInt(dia));
                                                
                                                fechaSeleccionadaDate.setDate(fechaSeleccionadaDate.getDate()-1);

                                                // Establecer la hora de las dos fechas a 00:00:00
                                                this.fechaEnTiempoReal.setHours(0, 0, 0, 0);
                                                fechaSeleccionadaDate.setHours(0, 0, 0, 0);
                                                                              
                                                if(this.fechaEnTiempoReal.getTime() < fechaSeleccionadaDate.getTime()){

                                                  if(horarioActualizado.EstadoConfirmacion == false){
                                                    this.sesionTutoriaService.reservaDELETE(reserva.idReserva!)
                                                    .then(() => {   
                                                      
                                                      // Cambiar el estado de reserva a reservado
                                                      horarioActualizado.Reservado = false;
                                                      horarioActualizado.MiReserva = false;

                                                      // Actualizar el objeto clonado en la matriz
                                                      this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] = horarioActualizado;  

                                                      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tu reserva fue cancelado con exito!' });
        
                                                    })
                                                    .catch((error) => {
                                                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al cancelar la reserva' });
                                                    })
                                                  }else{
                                                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'La reserva fue confirmado por su tutor, por lo tanto no puede cancelarlo.' });
                                                  }

                                                }else{
                                                  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'El plazo para cancelar su reserva ha expirado.' });
                                                }
                                              
                                              }                                     
                                            })                           
                                      });
                                })
                            })                  
                          break;
                        case ConfirmEventType.CANCEL:
                          break;
                      }//end switch
                    }//end reject
                    
                  })//End cofirmation service
                

                })//tutor sucess end
                .catch((error) => {
                  console.log("Ocurrio algun errror al recuperar tutor.");
                  
                });
        })//end datos tutorado
      }//end if
    }//end if
  }//si    
}

