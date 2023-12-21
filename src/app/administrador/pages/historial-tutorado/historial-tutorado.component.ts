import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
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
  selector: 'app-historial-tutorado',
  templateUrl: './historial-tutorado.component.html',
  styleUrls: ['./historial-tutorado.component.css'],
  providers: [
    { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() },
    { provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() }
  ]
})
export class HistorialTutoradoComponent {
  codeTutor           :string = "";
  tutorado!           : Tutorado;
  semestreActivo!     : Semestre;
  semestres           : Semestre[] = [];
  semestreSeleccionado: Semestre | null = null;
  sesionesFiltradas   : ResponseSesionTutoriaDto[] = [];
  detallesMostrados   : DetalleMostrar[] = [];
  placeholderDropdown : string=""; 
  constructor(
    private activatedRoute      : ActivatedRoute,
    private confAcademicaService: ConfiguracionAcademicaService,
    private sesionTutoriaService: SesionTutoriaService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.confAcademicaService.tutoradoGET(id))
      )
      .subscribe((result) => {
        this.tutorado = result;

        //Recuperar Tutor
        this.confAcademicaService.codeTutorByCodeTutoradoCargaTutoria(this.tutorado.code!)
            .then(resp=>{
              this.codeTutor = resp.codeTutor!;
            })

        this.sesionTutoriaService.sesionTutoriaAll().then((sesiones) => {
          //Recuperar sesiones de un determinado tutor
          this.sesionesFiltradas = this.filtrarSesionesPorIdTutorado(
            sesiones,
            this.tutorado.code!
          );

          // Llama a actualizarDetalles después de cargar sesionesFiltradas
          this.actualizarDetalles();
        });
      });

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
      detalles = detalles.filter(item => item.dimension !== 'Personal');
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

}
