import { Component, OnInit } from '@angular/core';
import { ConfiguracionAcademicaService, RequestCargaDto, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';
import { SesionTutoriaService } from 'src/app/services/Nswag/sesion-tutoria.service';

interface TutorMostrar {
  codeTutor               : string;
  nombresTutor            : string;
}

interface CargaMostrar {
  codeTutorado            : string;
  nombresTutorado         : string;
  codeTutor               : string;
  nombresTutor            : string;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [
    { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() }
  ]
})
export class ReportesComponent implements OnInit{
  listCargas                : RequestCargaDto[] = []
  listaCargasActivasMostrar : CargaMostrar[] =[]
  listaCargasActivasMostrarFiltrado : CargaMostrar[] =[]
  //dropdown

  tutorSeleccionado         : TutorMostrar | undefined;
  listaTutoresMostrar       : TutorMostrar[] = [] ;
  
  //cargas filtradas


  constructor(    
    private confAcademicaService: ConfiguracionAcademicaService
  ) {}

  async ngOnInit():  Promise<void> {
    //Recuperar cargas activas
  const listaCargas = await this.confAcademicaService.listaActivosCargaTutoria();

  //Recorrer cada objeto de listaCargas
  for (const carga of listaCargas) {
    //Recuperar informacion general de tutor
    const tutorObj = await this.confAcademicaService.tutorGET(carga.idTutor!);

    // buscar si el tutor ya existe en la lista
    const existe = this.listaTutoresMostrar.find(tutor => tutor.codeTutor === tutorObj.code);
    if (!existe) {
      let tutorMostrarObj: TutorMostrar = {
        codeTutor: carga.idTutor!,
        nombresTutor: "Tutor: "+" "+tutorObj.nombres! +" "+ tutorObj.apPaterno +" "+tutorObj.apMaterno
      };

      this.listaTutoresMostrar.push(tutorMostrarObj);
    }

    const tutoradoObj = await this.confAcademicaService.tutoradoGET(carga.idTutorado!);

    let cargaMostrarObj: CargaMostrar = {
      codeTutorado: carga.idTutorado!,
      nombresTutorado: tutoradoObj.nombres! +" "+ tutoradoObj.apPaterno+" " +tutoradoObj.apMaterno,
      codeTutor: carga.idTutor!,
      nombresTutor: tutorObj.nombres!+" " + tutorObj.apPaterno+" " +tutorObj.apMaterno
    };
    //Guardar objeto en lista
    this.listaCargasActivasMostrar.push(cargaMostrarObj);
  }

  
  if (this.listaTutoresMostrar.length>0){
    this.tutorSeleccionado = this.listaTutoresMostrar[0];
    this.filtrarCargasPorTutor(this.listaTutoresMostrar[0].codeTutor);

  }
  
  }

  onTutorChange(newTutor: TutorMostrar) {
    this.tutorSeleccionado = newTutor;
    this.filtrarCargasPorTutor(newTutor.codeTutor);
    
  }

  filtrarCargasPorTutor(tutorId: string) {
    // Filtra las cargas activas por el tutor seleccionado
    this.listaCargasActivasMostrarFiltrado = this.listaCargasActivasMostrar.filter(carga => carga.codeTutor === tutorId);
    
  }
  
  

}
