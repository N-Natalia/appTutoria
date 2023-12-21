import { Component } from '@angular/core';
import { ConfiguracionAcademicaService, RequestCargaDto, Semestre, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-distribucion-actualizada',
  templateUrl: './distribucion-actualizada.component.html',
  styleUrls: ['./distribucion-actualizada.component.css'],
  providers: [
    { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() },
  ]
})
export class DistribucionActualizadaComponent {
  CargasActivas: RequestCargaDto[] = [];
  ListaTutores: Tutor[] = [];
  semestre?: Semestre ;

  constructor(private configuracionAcademica: ConfiguracionAcademicaService) { }

  ngOnInit() {
    this.configuracionAcademica.semestreActivo()
      .then(semestre => {
        this.semestre = semestre;
      })
      .catch(error => {
        console.error('Error al cargar el semestre activo', error);
      });

    // Recuperar lista de tutores activos 
    this.configuracionAcademica.listaActivosCargaTutoria()
      .then(cargasActivas => {
        this.CargasActivas = cargasActivas;
        // console.log( this.CargasActivas)
        this.CargasActivas.forEach((carga) => {
          this.configuracionAcademica.tutorGET(carga.idTutor!)
            .then(tutor => {

              // buscar si el tutor ya existe en la lista
              const existe = this.ListaTutores.find(tutor => tutor.code === carga.idTutor);
              if (!existe) {
                this.ListaTutores.push(tutor);
              }
              
            })
        });
      })
  }
}

