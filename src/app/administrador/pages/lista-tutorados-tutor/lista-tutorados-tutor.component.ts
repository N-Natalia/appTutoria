import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfiguracionAcademicaService, RequestCargaDto, Tutor, Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';
import { SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

@Component({
  selector: 'app-lista-tutorados-tutor',
  templateUrl: './lista-tutorados-tutor.component.html',
  styleUrls: ['./lista-tutorados-tutor.component.css'],
  providers: [
    { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() },
    { provide: SesionTutoriaService, useFactory: () => new SesionTutoriaService() },
  ]
})
export class ListaTutoradosTutorComponent {
  CargasActivas: RequestCargaDto[] = [];
  ListaTutorados: Tutorado[] = [];
  tutor?: Tutor;

  constructor(private activatedRoute: ActivatedRoute, private configuracionAcademica: ConfiguracionAcademicaService) { }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.configuracionAcademica.tutorGET(id))
      )
      .subscribe(result => {
        this.tutor = result;
        this.configuracionAcademica.codeTutoradosByCodeTutorCargaTutoria(this.tutor?.code!)
          .then(listaCodeTutorados => {
            listaCodeTutorados.forEach((elemento) => {
              this.configuracionAcademica.tutoradoGET(elemento.idTutorado!)
                .then(tutorado => {
                  this.ListaTutorados.push(tutorado);
                })
            })
          })
      });
  }
}
