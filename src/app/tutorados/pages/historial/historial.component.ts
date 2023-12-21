import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService, Semestre, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { ResponseDetalleTutoriaDto, ResponseSesionTutoriaDto, SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

interface DetalleMostrar {
  idSesionTutoria         : number;
  idDetalleSesionTutoria  : number;
  dimension               : string;
  descripcion             : string;
  referencia              : string;
  observacion             : string;
  fecha                   : string;
}
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  providers: [
    { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() },
    { provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() }
  ]
})
export class HistorialComponent implements OnInit{
  codeTutorado        : string = "";
  tutorado!           : Tutorado;
  semestreActivo!     : Semestre;
  semestres           : Semestre[] = [];
  semestreSeleccionado: Semestre | null = null;
  sesionesFiltradas   : ResponseSesionTutoriaDto[] = [];
  detallesMostrados   : DetalleMostrar[] = [];
  placeholderDropdown : string="";
  constructor(
    private auhtService         : AuthService,
    private confAcademicaService: ConfiguracionAcademicaService,
    private sesionTutoriaService: SesionTutoriaService
  ) {}

  ngOnInit() {
    this.codeTutorado = this.auhtService.getCodeFromToken()
    this.confAcademicaService.tutoradoGET(this.codeTutorado)
        .then(tutorado =>{
          this.tutorado = tutorado;

          this.sesionTutoriaService.sesionTutoriaAll().then((sesiones) => {
            //Recuperar sesiones de un determinado tutor
            this.sesionesFiltradas = this.filtrarSesionesPorIdTutorado(
              sesiones,
              this.tutorado.code!
            );
            
  
            // Llama a actualizarDetalles después de cargar sesionesFiltradas
            this.actualizarDetalles();
          });
        })
    

    this.confAcademicaService
      .semestreActivo()
      .then(async (semestre) => {
        this.semestreActivo = semestre;
        this.semestreSeleccionado = this.semestreActivo;
        this.placeholderDropdown = "Semestre "+ this.semestreSeleccionado.denominacionSemestre;

        // Recuperar lista de semestres
        this.semestres = await this.confAcademicaService.semestreAll();
        this.semestres = this.semestres.map(semestre => {
          semestre.denominacionSemestre = 'Semestre ' + semestre.denominacionSemestre;
          return semestre;
        });

        //Ordenar semestres por id,  para mostrar por defecto al semstre activo
        this.semestres.sort((a, b) => b.idSemestre! - a.idSemestre!);
      });

    // Suscríbete a los cambios de semestreSeleccionado y llama a actualizarDetalles cuando cambie.
    this.confAcademicaService.semestreActivo().then((semestre) => {
      this.semestreSeleccionado = semestre;
    });
  }

  filtrarSesionesPorIdTutorado(sesiones: ResponseSesionTutoriaDto[],idTutoradoAFiltrar: string): ResponseSesionTutoriaDto[] {
    return sesiones.filter(
      (sesion) => sesion.idTutorado === idTutoradoAFiltrar
    );
  }

  formatearUTCFecha(fechaString: string): string {
    let fecha = new Date(fechaString);
    let dia = ("0" + fecha.getUTCDate()).slice(-2);
    let mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    let anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

  async obtenerFechaDesdeIdSesion(idSesion: number): Promise<string> {
    const sesion = await this.sesionTutoriaService.sesionTutoriaGET(idSesion);
    const fecha = this.formatearUTCFecha(sesion.fechaReunion?.toISOString()!);
    return fecha;
  }

  async detallesByIdSemestre(
    sesionesFiltradas: ResponseSesionTutoriaDto[],
    idSemestre: number
  ): Promise<ResponseDetalleTutoriaDto[]> {
    const sesionesBySemestre = sesionesFiltradas.filter(
      (sesion) => sesion.idSemestre === idSemestre
    );

    const promises: Promise<ResponseDetalleTutoriaDto[]>[] = [];

    sesionesBySemestre.forEach((sesion) => {
      promises.push(
        this.sesionTutoriaService.detallesByIdSesion(sesion.idSesionTutoria!)
      );
    });

    const results = await Promise.all(promises);

    const detallesBySemestre: ResponseDetalleTutoriaDto[] = [];
    results.forEach((detalles) => {
      //Filtrar detalles que no tienen ningun registro
      detalles = detalles.filter(item => item.descripcion != '' && item.observaciones != '' && item.referencia != '' );
      detallesBySemestre.push(...detalles);
    });

    return detallesBySemestre;
  }

  async actualizarDetalles() {
    if (this.semestreSeleccionado) {
      const detalles = await this.detallesByIdSemestre(
        this.sesionesFiltradas,
        this.semestreSeleccionado.idSemestre!
      );

      const fechasPromesas = detalles.map((detalle) =>
        this.obtenerFechaDesdeIdSesion(detalle.idSesionTutoria!)
      );

      const fechas = await Promise.all(fechasPromesas);

      this.detallesMostrados = detalles.map((detalle, index) => ({
        idSesionTutoria: detalle.idSesionTutoria!,
        idDetalleSesionTutoria: detalle.idDetalleSesionTutoria!,
        dimension: detalle.dimension!,
        descripcion: detalle.descripcion!,
        referencia: detalle.referencia!,
        observacion: detalle.observaciones!,
        fecha: fechas[index],
      }));

    }
  }

  onSemestreChange(newSemestre: Semestre) {
    this.semestreSeleccionado = newSemestre;
    this.actualizarDetalles();
  }
  retroceder(){
    window.history.back();
  }


}
