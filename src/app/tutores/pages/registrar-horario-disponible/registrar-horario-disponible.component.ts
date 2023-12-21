import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService } from 'src/app/services/Nswag/configuracion-academica.service';
import { ResponseTutorHorarioDisponibleDto, SesionTutoriaService, TutorHorarioDisponible } from 'src/app/services/Nswag/sesion-tutoria.service';

interface HorarioMostrar {
  IdTutorHorarioDisponible:   number;
  IdTutor                 :   string;
  Hora                    :   Date;
  Duracion                :   number;
  Dia                     :   string;
  Tipo                    :   string;
}


@Component({
  selector: 'app-registrar-horario-disponible',
  templateUrl: './registrar-horario-disponible.component.html',
  styleUrls: ['./registrar-horario-disponible.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class RegistrarHorarioDisponibleComponent {
  

  codeTutor               : string = "";
  listHorariosDisponibles : ResponseTutorHorarioDisponibleDto[] = []; 
  horarios!               : any[];
  diasSemana              : string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  tipoReservaSeleccionado : string | undefined;
  tipoReunion!             : string;
  horarioSeleccionado!     : any;

  tiposReunion: any[] = [
    { name: 'Presencial' },
    { name: 'Virtual'}
  ];

  dias: any[] = [
    { name: 'Lunes' },
    { name: 'Martes'},
    { name: 'Miércoles' },
    { name: 'Jueves'},
    { name: 'Viernes'},
  ];


  formNuevoIntervaloFila: FormGroup = this.fb.group({
    horaInicio          : ['',[Validators.required]],
    intervaloDuracion   : [ ,[Validators.required]],
    tipoReunion         : ["Presencial" ,[Validators.required]], 
    dia                 : ['Lunes',[Validators.required]]  
  });

  constructor(private fb                    : FormBuilder,
              private sesionTutoriaService  : SesionTutoriaService,
              private authService           : AuthService,
              private messageService        : MessageService,
              private confirmationService   : ConfirmationService,
              private confirmationService2   : ConfirmationService,){}
  
  ngOnInit(): void {

    // Recuperar codigo de tutor.
    this.codeTutor = this.authService.getCodeFromToken();

    // Recuperar tutor horario disponible
    this.sesionTutoriaService.listaHorariosByCodeTutor(this.codeTutor)
      .then( horarios => {
        this.listHorariosDisponibles = horarios;
        // Transformar lista de horarios diponibles a tipo horarios para mostrar  
        this.horarios = this.transformarHorariosDisponibles();  
        // Ordenar horarios por hora ascendentemente
        this.horarios.sort((a, b) => {
          return a.Hora.getTime() - b.Hora.getTime();
        });
        
      })        
            
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
        Tipo                    : horario.tipo!
      };
      ListHorarioMostrar.push(horarioMostrar);
    });

    // Agrupa los productos por Hora
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
  
  esDisponible(day: string, hour: number): boolean {
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

  convertirHoraDateACadena(hora: Date): string {
    const datePipe = new DatePipe('en-US');
    const horaCadena = datePipe.transform(hora, 'HH:mm:ss');
    return horaCadena!;
  }

  confirm1(clave: string,dia: string, hora: Date, duracion: number) {
  
    
    //Horario seleccionado
    let horarioSeleccionado = this.listHorariosDisponibles.find(horario => horario.dia == dia && horario.hora === this.convertirHoraDateACadena(hora));
    this.horarioSeleccionado = horarioSeleccionado;
    

    const fechaIndex = this.diasSemana.indexOf(dia);
    if (fechaIndex !== -1) {
                
      this.confirmationService.confirm({
        key: clave,
        //Message
        message: // Retornar el contenido HTML como una cadena
          `
          <table class="bg-blue-100 p-4 ">          
            <tbody>
              <tr>
                <td class="font-bold">Día</td>
                <td>:</td>
                <td>
                  <div class="ml-2">
                    ${this.diasSemana[fechaIndex]} 
                  </div>          
                </td>
              </tr>
              
              <tr>
                <td class="font-bold">Duración</td>
                <td>:</td>
                <td> <div class="ml-2">${duracion}</div></td>
              </tr>
              <tr>
                <td class="font-bold">Hora</td>
                <td>:</td>
                <td><div class="ml-2">${this.formatoTiempoConDuracion(hora, duracion)}</div></td>
              </tr>
              
            </tbody>   
          </table>
        `,                        
        accept: () => {    

          const stringHora = this.convertirHoraDateACadena(hora);    

          //Crear el objedo requestprogramacion
          let tutorHorarioDisponibleNew = new TutorHorarioDisponible();          
          tutorHorarioDisponibleNew.idTutor = this.codeTutor;
          tutorHorarioDisponibleNew.hora = stringHora;
          tutorHorarioDisponibleNew.duracion = duracion;
          tutorHorarioDisponibleNew.dia = dia == null? 'Lunes':dia;
          tutorHorarioDisponibleNew.tipo = this.tipoReunion=='Virtual'? 1:0;
          tutorHorarioDisponibleNew.activo = true;
          
          //Guardar tutor horario disponible
          this.sesionTutoriaService.tutorHorarioDisponiblePOST(tutorHorarioDisponibleNew)
              .then(()=>{
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El horario fue agregado con exito!' });
                window.location.reload(); 
              })
              .catch((error)=>{
                
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al agregar el horario' });
              })  
          
          
                   
        },
        reject: (type: ConfirmEventType) => {
          switch (type) {
            case ConfirmEventType.REJECT:


              //Crear el objedo requestprogramacion
              let tutorHorarioDisponibleUpdated = new TutorHorarioDisponible();
              tutorHorarioDisponibleUpdated.idHorario = horarioSeleccionado?.idHorario;
              tutorHorarioDisponibleUpdated.idTutor = horarioSeleccionado?.idTutor!;
              tutorHorarioDisponibleUpdated.hora = horarioSeleccionado?.hora;
              tutorHorarioDisponibleUpdated.duracion = horarioSeleccionado?.duracion;
              tutorHorarioDisponibleUpdated.dia = horarioSeleccionado?.dia;
              tutorHorarioDisponibleUpdated.tipo = horarioSeleccionado?.tipo=='Virtual'? 1:0;
              tutorHorarioDisponibleUpdated.activo = false;
              
             
              this.sesionTutoriaService.tutorHorarioDisponiblePUT(tutorHorarioDisponibleUpdated)
                  .then(()=>{
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El horario fue eliminado con exito!' });
                    window.location.reload(); 
                  })
                  .catch((error)=>{
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al eliminar el horario' });
                  })  
                     
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
    })                   
                
    }
  }

  confirm2(clave: string) {
    
    
    this.confirmationService2.confirm({
      key:clave,
      //Message
      message: // Retornar el contenido HTML como una cadena
        `
        <div >Complete los datos necesarios:</div>  
      `,                        
      accept: () => {    

        if(this.formNuevoIntervaloFila.valid){
          const { horaInicio, intervaloDuracion,tipoReunion,dia } = this.formNuevoIntervaloFila.value;
          const stringHora = this.convertirHoraDateACadena(horaInicio);  

          this.sesionTutoriaService.listaHorariosByCodeTutor(this.codeTutor)
              .then(listaHorariosExit=>{

                const existeHora = listaHorariosExit.some((horario: any) => horario.hora === stringHora);

                if(existeHora==true){
                  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'La hora ingresada ya existe, registre su horario mediante las celdas de la tabla.' });
                                  
                }else{

                  //Crear el objedo requestprogramacion
                  let tutorHorarioDisponibleNew = new TutorHorarioDisponible();
                  tutorHorarioDisponibleNew.idTutor = this.codeTutor;
                  tutorHorarioDisponibleNew.hora = stringHora;
                  tutorHorarioDisponibleNew.duracion = intervaloDuracion;
                  tutorHorarioDisponibleNew.dia = dia.name == null ? 'Lunes':dia.name;
                  tutorHorarioDisponibleNew.tipo = tipoReunion=='Virtual'? 1:0;
                  tutorHorarioDisponibleNew.activo = true;                  

                  //Guardar tutor horario disponible
                  this.sesionTutoriaService.tutorHorarioDisponiblePOST(tutorHorarioDisponibleNew)
                      .then(()=>{  
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El horario fue agregado con éxito!' });

                        setTimeout(() => {
                          window.location.reload(); 
                        }, 2000);
                      })
                      .catch((error)=>{
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió algún error al agregar el horario' });
                      }) 
                } 
              })
        }     
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
