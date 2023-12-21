import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EmailSendService } from 'src/app/auth/services/email-send.service';
import { ConfiguracionAcademicaService, Tutor, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { RequestReservaByIdHorarioHoraFechaDto, ResponseTutorHorarioDisponibleDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';


interface HorarioMostrar {
  IdTutorHorarioDisponible:   number;
  IdTutor                 :   string;
  Hora                    :   Date;
  Duracion                :   number;
  Dia                     :   string;
  Tipo                    :   string;
  Reservado               :   boolean;
  EstadoConfirmacion      :   boolean;
}

@Component({
  selector: 'app-estado-reservas-voluntarias',
  templateUrl: './estado-reservas-voluntarias.component.html',
  styleUrls: ['./estado-reservas-voluntarias.component.css'],
  providers: [
    {
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService()
    },
    {
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService()
    },
  ]
})
export class EstadoReservasVoluntariasComponent implements OnInit {

  codeTutorado            : string = "";
  codeTutor               : string = "";
  listHorariosDisponibles : ResponseTutorHorarioDisponibleDto[] = [];
  Tutorado!               : Tutorado;
  Tutor!                  : Tutor;
  horarios!               : any[];
  horariosSinAgrupar!     : HorarioMostrar[];
  horariosSinAgruparCompleto: HorarioMostrar[][]=[[]];
  diasSemana              : string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  datosParaMostrar        : string[] = [];

  fechaEnTiempoReal       : Date = new Date();
  fechas                  : Date[] = [];
  emailTutor              : string = "";
  semanaActual                      : number = 0;
  semanasSiguientes                 : number = 2; // Muestra las próximas 2 semanas
  posicionFechaMostrar              : number = 0;
  fechas3SemanasString              : string[][] = [[]];
  fechas3SemanasDate                : Date[][] = [[]];

  estadoConfirmacion!               : boolean;
  visible                           : boolean = false;
  

  constructor(private router                : Router,
              private confAcademicaService  : ConfiguracionAcademicaService,
              private sesionTutoriaService  : SesionTutoriaService,
              private confirmationService   : ConfirmationService,
              private authService           : AuthService,
              private messageService        : MessageService,
              private emailSendService      : EmailSendService){
  }

  ngOnInit(): void {

    // Recuperar codigo de tutor.
    this.codeTutor = this.authService.getCodeFromToken();

    this.confAcademicaService.tutorGET(this.codeTutor)
        .then(tutor=>{
          this.Tutor = tutor;
        })

    const fechaActual = new Date();
    this.fechaEnTiempoReal = fechaActual;

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: '2-digit' };
   
    //  Fechas para las 3 semanas de tipo string
    this.fechas3SemanasString = this.calcularFechasParaSemanas();
    // Fechas para mostrar en base a la posicion de la semana : 0 -> semana actual,..-
    this.datosParaMostrar = this.fechas3SemanasString[this.posicionFechaMostrar];
    //  Fechas para las 3 semanas de tipo string
    this.fechas3SemanasDate =  this.calcularFechasParaSemanasDate();


    //Convertir arreglo de datosparaMostrar en tipo date cada elemento
    this.fechas = this.datosParaMostrar.map(fecha => {
      let [dia, mes, ano] = fecha.split('/');
      return new Date(parseInt('20' + ano), parseInt(mes) - 1, parseInt(dia));
    });


    //  Obtener fechas limites de las semanas para buscar reservas realizadas
    let fechaInicio = this.datosParaMostrar[this.semanaActual];
    let fechaLimite =this.fechas3SemanasString[this.semanasSiguientes][this.datosParaMostrar.length - 1];

    let [diaInicio, mesInicio, anioInicio] = fechaInicio.split('/');
    let [diaLimite, mesLimite, anioLimite] = fechaLimite.split('/');

    let anioInicioCompleto = '20' + anioInicio;
    let anioLimiteCompleto = '20' + anioLimite;

    // Recuperar tutor horario disponible
    this.sesionTutoriaService.listaHorariosByCodeTutor(this.codeTutor)
      .then( horarios => {
        this.listHorariosDisponibles = horarios;
        // Transformar lista de horarios diponibles a tipo horarios para mostrar
        this.horarios = this.transformarHorariosDisponibles();

        // Recuperar reservas hechas por otros usuarios
        this.sesionTutoriaService.reservasPorIntervaloFechaTipoVoluntario(parseInt(anioInicioCompleto),parseInt(mesInicio),parseInt(diaInicio),parseInt(anioLimiteCompleto),parseInt(mesLimite),parseInt(diaLimite))
            .then(reservasRealizadas => {

              this.horariosSinAgrupar.map(dato => {

                let reserva = reservasRealizadas.find(reserva => reserva.idTutorHorarioDisponible == dato.IdTutorHorarioDisponible);
                if (reserva) {

                  const indiceFecha = this.obtenerIndiceFecha(reserva.fecha!);
                  // Verifica si el índice de fecha es válido
                  if (indiceFecha >= 0 && indiceFecha < this.horariosSinAgruparCompleto.length){
                    // Busca el horario dentro del array correspondiente
                    const horarioBasadoFecha = this.horariosSinAgruparCompleto[indiceFecha].find(dato => dato.IdTutorHorarioDisponible == reserva?.idTutorHorarioDisponible);
                    // Verifica si se encontró el horario
                    if (horarioBasadoFecha) {

                      const estadoConfirm = reserva.estadoConfirmacion === "Solicitado";
                      this.estadoConfirmacion = !estadoConfirm;
                      // Actualiza el elemento en horariosSinAgruparCompleto
                      const indiceHorario = this.horariosSinAgruparCompleto[indiceFecha].indexOf(horarioBasadoFecha);

                      this.horariosSinAgruparCompleto[indiceFecha][indiceHorario] = {
                        ...horarioBasadoFecha,
                        Reservado: true,
                        EstadoConfirmacion: !estadoConfirm
                      };
                    }
                  }
                }
              })
            })
          // ordenar horarios por hora
          this.horarios.sort((a, b) => {
            return a.Hora.getTime() - b.Hora.getTime();
        });
      })

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
        EstadoConfirmacion      : false
      };
      ListHorarioMostrar.push(horarioMostrar);
    });

    //Lista horarios mostrar sin agrupar
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
  showDialog() {
    this.visible = true;
  }

  convertirHoraStringADate(horaString: string): Date {
    // Extraer las horas y los minutos del string
    let partes = horaString.split(':');
    let horas = +partes[0];
    let minutos = +partes[1];
    return new Date(0, 0, 0,horas,minutos);
  }

  esDisponible(day: string, hour: Date): boolean {
    return this.horarios.some(horario => horario.Dia.includes(day) && horario.Hora === hour);
  }

  formatoTiempoConDuracion(hora: Date, duracion: number): string {
    const startTime = new Date(hora);
    const endTime = new Date(hora);
    endTime.setMinutes(endTime.getMinutes() + duracion);
    const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedStartTime} - ${formattedEndTime}`;
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
  atender(code:string) {

    this.router.navigate([`/tutores/fichaTutoriaVoluntaria/${code}`]);
    this.estadoConfirmacion = true;
  }

  //Devuelve el estado de reserva de un determinado horario de una determinada semana

  horarioNoAgrupadoReservado(dia: string, hora: Date){
    const horarioExistenteNoAgrupado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].find(horario => horario.Dia==dia && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora));
    return horarioExistenteNoAgrupado?.Reservado;
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
    return !this.esDisponible(dia,hora) ? '' :
    (this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoEstadoConfirmacion(dia,hora) && this.esDisponible(dia,hora)) ? 'Reservado'+' ('+this.horarioNoAgrupadoTipo(dia,hora)+')':
    this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoEstadoConfirmacion(dia,hora) && this.esDisponible(dia,hora)
    ? 'Reserva confirmado': 'Disponible'+' ('+this.horarioNoAgrupadoTipo(dia,hora)+')';

  }

  estadoGreen(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && !this.horarioNoAgrupadoReservado(dia,hora)
  }
  estadoBlue(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoEstadoConfirmacion(dia,hora);
  }
  estadoSky(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoEstadoConfirmacion(dia,hora);
  }
  buttomDesabilitado(dia:string,hora:Date,posicion:number){
    return !this.esDisponible(dia,hora) ||
    (this.esDisponible(dia,hora) && !this.horarioNoAgrupadoReservado(dia,hora) ) ||
    this.fechas[posicion] <= this.fechaEnTiempoReal && !this.estadoSky(dia,hora) && this.posicionFechaMostrar==0 ;

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
            <td><div class="ml-2">${this.formatoTiempoConDuracion(hora, duracion)}</div></td>
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

  messageTipoVirtual(Tutorado: Tutorado, fechaSeleccionada: string, hora: Date, duracion: number,enlaceMeet: string): any {
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
              <a class="ml-2" href="${enlaceMeet}" target="_blank"> ${enlaceMeet}</a>
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
      let [dia, mes, anio] = fechaSeleccionada.split('/');

      // Recuperar el indice del subarray del horario especifico seleccionado
      const horarioIndexSeleccionado = this.horariosSinAgruparCompleto[this.posicionFechaMostrar].findIndex(horario =>
        horario.Dia == diaSemana && this.convertirHoraDateACadena(horario.Hora) == this.convertirHoraDateACadena(hora)
      );

      if(horarioIndexSeleccionado !== -1){

        // Clonar el objeto para evitar modificar una referencia compartida entre los demas subarrays
        const horarioActualizado = { ...this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] };

        // Crear objeto de tipo  RequestreservaDto
        let requestReservaDto = new RequestReservaByIdHorarioHoraFechaDto();
        requestReservaDto.idTutorHorarioDisponible = horarioActualizado.IdTutorHorarioDisponible;
        requestReservaDto.fecha = new Date(parseInt('20' + anio), parseInt(mes) - 1, parseInt(dia));
        requestReservaDto.hora = this.convertirHoraDateACadena(hora);

        // Recuperar Reserva
        this.sesionTutoriaService.reservaByIdHorarioHoraFecha(requestReservaDto)
            .then(reserva =>{

              //Recuperar tutorado que realizo la reserva
              this.confAcademicaService.codeTutoradoByIdCarga(reserva.idCargaTutoria!)
                  .then(resp =>{
                    this.codeTutorado = resp.codeTutorado!;
                    //Recuperar datos de tutorado
                    this.confAcademicaService.tutoradoGET(this.codeTutorado)
                        .then(tutorado =>{
                          this.Tutorado = tutorado;

                          // Definir el mensaje en función del tipo de horario
                          let message = '';

                          if (horarioActualizado?.Tipo === 'Virtual') {
                            message = this.messageTipoVirtual(this.Tutorado, fechaSeleccionada, hora, duracion,this.Tutor.enlaceReunion!);

                          } else if (horarioActualizado?.Tipo === 'Presencial') {
                            let salaReunion =this.Tutor.lugarReunion!;
                            if(!salaReunion){salaReunion = ""}
                            message = this.messageTipoPresencial(this.Tutorado, fechaSeleccionada, hora, duracion,salaReunion);
                          }

                          this.confirmationService.confirm({
                            //Message
                            message: message,
                            accept: () => {

                              

                              let [dia, mes, ano] = fechaSeleccionada.split('/');          
                              const fechaSeleccionadaDate =  new Date(parseInt('20' + ano), parseInt(mes) - 1, parseInt(dia));
                              
                              fechaSeleccionadaDate.setDate(fechaSeleccionadaDate.getDate()-1);

                              // Establecer la hora de las dos fechas a 00:00:00
                              this.fechaEnTiempoReal.setHours(0, 0, 0, 0);
                              fechaSeleccionadaDate.setHours(0, 0, 0, 0);
                                                            
                              if(this.fechaEnTiempoReal.getTime() < fechaSeleccionadaDate.getTime()){
                                this.sesionTutoriaService.confirmarByIdReserva(reserva.idReserva!)
                                  .then(()=>{
                                    //Actualizar estado de confirmacion
                                    horarioActualizado.EstadoConfirmacion = true;

                                    // Actualiza el objeto clonado en la matriz
                                    this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] = horarioActualizado;


                                    this.estadoConfirmacion = horarioActualizado.EstadoConfirmacion;

                                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reserva confirmado!' });


                                    this.emailSendService.sendConfirmacionReservaNotificationEmail(this.Tutorado.email!)
                                        .subscribe({
                                            next: (res) =>{
                                              console.log("Email de notificacion fue enviado con exito.");
                                            },
                                            error:(err)=>{
                                              console.log("Hubo algun errror al enviar el email de notificación");
                                            }
                                        })

                                  })
                                  .catch((error) => {

                                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al confirmar la reserva.' });
                                  });

                              }else{
                                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'El plazo para confirmar la reserva ha expirado.' });
                              }
                              
                            },
                            reject: (type: ConfirmEventType) => {
                              switch (type) {
                                case ConfirmEventType.REJECT:
                                  if(this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado].EstadoConfirmacion  == true){
                                    this.sesionTutoriaService.cancelarConfirmacionByIdReserva(reserva.idReserva!)
                                      .then(()=>{
                                        //Actualizar estado de confirmacion
                                        horarioActualizado.EstadoConfirmacion = false;

                                        // Actualizar el objeto clonado en la matriz
                                        this.horariosSinAgruparCompleto[this.posicionFechaMostrar][horarioIndexSeleccionado] = horarioActualizado;

                                        this.estadoConfirmacion = horarioActualizado.EstadoConfirmacion;

                                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Confirmación de reserva cancelado con éxito!' });
                                      })
                                      .catch((error) => {

                                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió algun error al cancelar la confirmación de la reserva.' });
                                      });
                                  }else{
                                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Esta reserva no fue confirmado.' });
                                  }
                                  

                                  break;
                                case ConfirmEventType.CANCEL:
                                  break;
                              }
                            }
                        })
                  })
            })
        })
      }
    }
  }
}
