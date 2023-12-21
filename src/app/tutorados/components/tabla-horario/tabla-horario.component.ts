import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EmailSendService } from 'src/app/auth/services/email-send.service';
import { ConfiguracionAcademicaService, Tutor, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { ResponseReservaDto, ResponseTutorHorarioDisponibleDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

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
  selector: 'app-tabla-horario',
  templateUrl: './tabla-horario.component.html',
  styleUrls: ['./tabla-horario.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class TablaHorarioComponent implements OnInit{

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
              private authService           : AuthService,
              private emailSendService      : EmailSendService){}

  ngOnInit(): void {

    // Recuperar codigo de tutorado.
    this.codeTutorado = this.authService.getCodeFromToken();

    const fechaActual = new Date();
    this.fechaEnTiempoReal = fechaActual;
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: '2-digit' };
    const formattedDate = fechaActual.toLocaleDateString('es-ES', options);

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
                              console.log(this.reservaVoluntariaActivo);
                              
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
  ConvertirHoraStringDeHoraDate(hora: Date): string {
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
    return !this.esDisponible(dia,hora) || (this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && !this.horarioNoAgrupadoMiReserva(dia,hora)) || this.fechas[posicion] <= this.fechaEnTiempoReal && this.posicionFechaMostrar==0 ;

  }
  checkboxExist(dia:string,hora:Date){
    return this.esDisponible(dia,hora) && this.horarioNoAgrupadoReservado(dia,hora) && this.horarioNoAgrupadoMiReserva(dia,hora);
  }  


  

}
