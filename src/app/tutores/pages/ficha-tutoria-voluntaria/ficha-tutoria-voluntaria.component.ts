import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Semestre, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { RequestDetalleTutoriaDto, RequestSesionTutoriaDto, ResponseReservaDto, ResponseSesionTutoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

@Component({
  selector: 'app-ficha-tutoria-voluntaria',
  templateUrl: './ficha-tutoria-voluntaria.component.html',
  styleUrls: ['./ficha-tutoria-voluntaria.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    },
    { 
      provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() 
    },
  ]
})
export class FichaTutoriaVoluntariaComponent implements OnInit {
  formControlNamesCuadro: string[][] = [
    ['descripcion_DAcademica', 'referencia_DAcademica', 'observacion_DAcademica'],
    ['descripcion_DProfesional', 'referencia_DProfesional', 'observacion_DProfesional'],
    ['descripcion_DPersonal', 'referencia_DPersonal', 'observacion_DPersonal']
  ];
  
  codeTutor               : string = "";
  idCarga!                : number;
  tutorado!               : Tutorado;
  reservaVoluntariaActiva!: ResponseReservaDto;
  //programacionActivo!     :ResponseProgramacionReservaObligatoriaDto;
  fechaCadena             :string="";
  semestreDenominacion    :string= "";
  semestreActivo!          : Semestre;
  dimensiones             : string[]=["académico", "profesional","personal"];

  labels                  :string[] = ["Nro Celular","Dirección","Persona referencia","Nro celular de referencia"]
  formControlNames        :string[] = ["nroCelular_tutorado","direccion_tutorado","namePersonReferencia","nroCelPersonaReferencia","DAcademica_descripcion","DAcademica_referencia","DAcademica_observacion","DProfesional_descripcion","DProfesional_referencia","DProfesional_observacion","DPersonal_descripcion","DPersonal_referencia","DPersonal_observacion"]
  
  
  nroCelularT         : string = "";
  direccionT          : string = "";
  personaRef          : string = "";
  nroCelPersonaRef    : string = "";

  formFichaSesionTutoria: FormGroup = this.fb.group({
    nroCelular_tutorado       : ['',[Validators.minLength(9)]],
    direccion_tutorado        : [''],
    namePersonReferencia      : [''] ,
    nroCelPersonaReferencia   : ['',[Validators.minLength(9)]],
    DAcademica_descripcion   : [''],
    DAcademica_referencia     : [''],
    DAcademica_observacion    : [''],
    DProfesional_descripcion  : [''],
    DProfesional_referencia   : [''],
    DProfesional_observacion  : [''],
    DPersonal_descripcion     : [''],
    DPersonal_referencia      : [''],
    DPersonal_observacion     : ['']

  });


  constructor(private fb                    : FormBuilder,
              private activatedRoute        : ActivatedRoute,
              private confAcademicaService  : ConfiguracionAcademicaService,
              private sesionTutoriaService  : SesionTutoriaService,
              private authService           : AuthService,
              private messageService        : MessageService){}

  ngOnInit() {

    //recuperar code tutor
    this.codeTutor = this.authService.getCodeFromToken();
    //Recuperar semestre 
    this.confAcademicaService.semestreActivo()
        .then(semestre=>{
          this.semestreActivo = semestre;
          this.semestreDenominacion = semestre.denominacionSemestre;
        })

    this.activatedRoute.params
      .pipe(
        switchMap(({ id } ) => this.confAcademicaService.tutoradoGET(id) )        
      )
      .subscribe(result => {
        this.tutorado = result; 
        this.nroCelularT = result.nroCelular==0? "":result.nroCelular?.toString()!;
        this.direccionT = result.direccion==null?"":result.direccion;
        this.personaRef = result.personReferencia==null?"":result.personReferencia;
        this.nroCelPersonaRef =  result.nroCelularPersonaReferencia==0?"":result.nroCelularPersonaReferencia?.toString()!;        
        
        //Recuperar idcarga by codeTutorado
        this.confAcademicaService.idCargaByCodeTutorado(this.tutorado.code!)
            .then(result =>{
              this.idCarga = result.idCarga!;

              //Recuperar reserva activa por idCarga

              this.sesionTutoriaService.reservaVoluntarioActivoByIdCarga(this.idCarga)
                  .then(reservaEncontrado =>{
                    this.reservaVoluntariaActiva = reservaEncontrado;
                    console.log("Resera voluntaria", this.reservaVoluntariaActiva);                    

                    this.fechaCadena =this.formatearUTCFecha(this.reservaVoluntariaActiva.fecha!.toISOString());


                    //Recuperar idSesion Tutoria
                    this.sesionTutoriaService.sesionByIdReserva(this.reservaVoluntariaActiva.idReserva!)
                    .then(resp=>{

                      this.sesionTutoriaService.detallesByIdSesion(resp.idSesionTutoria!)
                          .then(detallesExistentes =>{
                            
                            if(detallesExistentes){
                              const detalleAcademico = detallesExistentes.find(detalle => detalle.dimension == "Academico" );
                              
                              const detalleProfesional = detallesExistentes.find(detalle => detalle.dimension == "Profesional" ); 
                              const detallePersonal = detallesExistentes.find(detalle => detalle.dimension == "Personal" );

                              this.formFichaSesionTutoria.patchValue({
                                DAcademica_descripcion   : detalleAcademico?.descripcion,
                                DAcademica_referencia     : detalleAcademico?.referencia,
                                DAcademica_observacion    : detalleAcademico?.observaciones,
                                DProfesional_descripcion  : detalleProfesional?.descripcion,
                                DProfesional_referencia   : detalleProfesional?.referencia,
                                DProfesional_observacion  : detalleProfesional?.observaciones,
                                DPersonal_descripcion     : detallePersonal?.descripcion,
                                DPersonal_referencia      : detallePersonal?.referencia,
                                DPersonal_observacion     : detallePersonal?.observaciones
                                
                              });
                            }
                          })
                    })
                    .catch((errr)=>{
                      console.log("La sesion aun no fue creada.");
                    })
                  })
            })

      });
    
  } 
  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  convertirFechaACadena(fecha: Date): string {
    const datePipe = new DatePipe('en-US');
    const fechaCadena = datePipe.transform(fecha, 'dd/MM/yyyy');
    return fechaCadena!;
  }
  
  onSubmit(){
    if(this.formFichaSesionTutoria.valid)
    {
      
      const {nroCelular_tutorado, direccion_tutorado,namePersonReferencia,nroCelPersonaReferencia,DAcademica_descripcion,DAcademica_referencia,DAcademica_observacion,DProfesional_descripcion,DProfesional_referencia,DProfesional_observacion,DPersonal_descripcion,DPersonal_referencia,DPersonal_observacion} = this.formFichaSesionTutoria.value; 

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
            //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Datos del tutorado fueron actualizados con exito!' });
          })
          .catch((error) => {
            //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al actualizar datos del tutorado' });
          });
      
      console.log("reserva voluntaria activa:",this.reservaVoluntariaActiva);
          

      //Recuperar idSesion Tutoria
      this.sesionTutoriaService.sesionByIdReserva(this.reservaVoluntariaActiva?.idReserva!)
        .then(resp=>{
          console.log("sesion: ", resp);

          //agregar o actualizar detalles
          this.agregarOrUpdtadeDetalles(resp,DAcademica_descripcion,DAcademica_referencia, DAcademica_observacion, DProfesional_descripcion, DProfesional_referencia,  DProfesional_observacion, DPersonal_descripcion, DPersonal_referencia, DPersonal_observacion)

        })
        .catch((error) => {
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al actualizar datos del tutorado' });
          //Guardar ficha sesion de tutoria 
          let nuevaSesion = new RequestSesionTutoriaDto();
          nuevaSesion.idReserva = this.reservaVoluntariaActiva.idReserva;
          nuevaSesion.idTutorado = this.tutorado.code;
          nuevaSesion.idTutor = this.codeTutor;
          nuevaSesion.idSemestre = this.semestreActivo.idSemestre;
          nuevaSesion.fechaReunion = this.reservaVoluntariaActiva.fecha;
          nuevaSesion.hora = this.reservaVoluntariaActiva.horaTutoria;
          
          this.sesionTutoriaService.sesionTutoriaPOST(nuevaSesion)
              .then(()=>{
                console.log("Sesion agregada con exito.");
                this.sesionTutoriaService.sesionByIdReserva(this.reservaVoluntariaActiva?.idReserva!)
                    .then(resp=>{

                      //agregar o actualizar detalles
                      this.agregarOrUpdtadeDetalles(resp,DAcademica_descripcion,DAcademica_referencia, DAcademica_observacion, DProfesional_descripcion, DProfesional_referencia,  DProfesional_observacion, DPersonal_descripcion, DPersonal_referencia, DPersonal_observacion)
                    })

              })
              .catch((errr)=>{
                console.log("Ocurrio algun error al agregar la sesion o la sesion ya fue agregada.");
              })
          
        });
    }
  }
  agregarOrUpdtadeDetalles(respReserva: ResponseSesionTutoriaDto,DAcademica_descripcion:string,DAcademica_referencia:string, DAcademica_observacion:string, DProfesional_descripcion:string, DProfesional_referencia:string,  DProfesional_observacion:string, DPersonal_descripcion: string, DPersonal_referencia : string, DPersonal_observacion:string ){
    this.sesionTutoriaService.detallesByIdSesion(respReserva.idSesionTutoria!)
        .then(detallesExistentes =>{      
      
          if(detallesExistentes.length != 0){

            const detalleAcademico = detallesExistentes.find(detalle => detalle.dimension == "Academico" );                   
            const detalleProfesional = detallesExistentes.find(detalle => detalle.dimension == "Profesional" ); 
            const detallePersonal = detallesExistentes.find(detalle => detalle.dimension == "Personal" ); 
            // Crear objetos de tipo detalle sesion                          

            let detalleSesion_Academico = new RequestDetalleTutoriaDto()
            detalleSesion_Academico.idDetalleSesionTutoria = detalleAcademico?.idDetalleSesionTutoria;
            detalleSesion_Academico.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Academico.dimension = 0;
            detalleSesion_Academico.descripcion = DAcademica_descripcion;
            detalleSesion_Academico.referencia = DAcademica_referencia;
            detalleSesion_Academico.observaciones = DAcademica_observacion;

            let detalleSesion_Profesional = new RequestDetalleTutoriaDto()
            detalleSesion_Profesional.idDetalleSesionTutoria = detalleProfesional?.idDetalleSesionTutoria;
            detalleSesion_Profesional.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Profesional.dimension = 1;
            detalleSesion_Profesional.descripcion = DProfesional_descripcion;
            detalleSesion_Profesional.referencia = DProfesional_referencia;
            detalleSesion_Profesional.observaciones = DProfesional_observacion;

            let detalleSesion_Personal = new RequestDetalleTutoriaDto()
            detalleSesion_Personal.idDetalleSesionTutoria = detallePersonal?.idDetalleSesionTutoria;
            detalleSesion_Personal.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Personal.dimension = 2;
            detalleSesion_Personal.descripcion = DPersonal_descripcion;
            detalleSesion_Personal.referencia = DPersonal_referencia;
            detalleSesion_Personal.observaciones = DPersonal_observacion;
            
            let promesa1 = this.sesionTutoriaService.detalleTutoriaPUT(detalleSesion_Academico)
              .then(() => {               
                console.log("Actualizado con éxito detalle académico");
              });

            let promesa2 = this.sesionTutoriaService.detalleTutoriaPUT(detalleSesion_Profesional)
              .then(() => {                
                console.log("Actualizado con éxito detalle profesional");
              });

            let promesa3 = this.sesionTutoriaService.detalleTutoriaPUT(detalleSesion_Personal)
              .then(() => {
                console.log("Actualizado con éxito detalle personal");
              });

            Promise.race([promesa1, promesa2, promesa3])
              .then(() => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ficha de tutoria de la sesión actualizada con éxito!' });
              })
              .catch(() => {
                // Manejar cualquier error
              });
          }else{
            // Crear objetos de tipo detalle sesion                          

            let detalleSesion_Academico = new RequestDetalleTutoriaDto()
            detalleSesion_Academico.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Academico.dimension = 0;
            detalleSesion_Academico.descripcion = DAcademica_descripcion;
            detalleSesion_Academico.referencia = DAcademica_referencia;
            detalleSesion_Academico.observaciones = DAcademica_observacion;

            let detalleSesion_Profesional = new RequestDetalleTutoriaDto()
            detalleSesion_Profesional.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Profesional.dimension = 1;
            detalleSesion_Profesional.descripcion = DProfesional_descripcion;
            detalleSesion_Profesional.referencia = DProfesional_referencia;
            detalleSesion_Profesional.observaciones = DProfesional_observacion;

            let detalleSesion_Personal = new RequestDetalleTutoriaDto()
            detalleSesion_Personal.idSesionTutoria = respReserva.idSesionTutoria;
            detalleSesion_Personal.dimension = 2;
            detalleSesion_Personal.descripcion = DPersonal_descripcion;
            detalleSesion_Personal.referencia = DPersonal_referencia;
            detalleSesion_Personal.observaciones = DPersonal_observacion;
            //Guardar objetos de tipo detalle sesiom
            //Guardar objetos de tipo detalle sesiom
            const promesa1 = this.sesionTutoriaService.detalleTutoriaPOST(detalleSesion_Academico)
              .then(() => {
                console.log("Guardado con éxito detalle académico");
              });

            const promesa2 = this.sesionTutoriaService.detalleTutoriaPOST(detalleSesion_Profesional)
              .then(() => {
                console.log("Guardado con éxito detalle profesional");
              });

            const promesa3 = this.sesionTutoriaService.detalleTutoriaPOST(detalleSesion_Personal)
              .then(() => {
                console.log("Guardado con éxito detalle personal");
              });

            Promise.race([promesa1, promesa2, promesa3])
              .then(() => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ficha de sesion de tutoria guardado con exito.' });
              })
              .catch(() => {
                // Manejar cualquier error
              });
          }
        })
  }
  retroceder(){
    window.history.back();
  }

}
