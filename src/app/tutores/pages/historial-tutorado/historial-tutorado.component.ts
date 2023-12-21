import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
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
export class HistorialTutoradoComponent implements OnInit {
  tutorado!           : Tutorado;

  constructor(
    private activatedRoute      : ActivatedRoute,
    private confAcademicaService: ConfiguracionAcademicaService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.confAcademicaService.tutoradoGET(id))
      )
      .subscribe((result) => {
        this.tutorado = result;
      });

    
  }
  retroceder(){
    window.history.back();
  }

}