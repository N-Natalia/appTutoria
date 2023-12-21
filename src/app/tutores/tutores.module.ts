import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutoresRoutingModule } from './tutores-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FichaTutoriaObligatoriaComponent } from './pages/ficha-tutoria-obligatoria/ficha-tutoria-obligatoria.component';
import { DatosTutoradoComponent } from './components/datos-tutorado/datos-tutorado.component';
import { InputDataComponent } from './components/input-data/input-data.component';

import { HomeComponent } from './home/home.component';
import { ActividadSesionTutoriaComponent } from './components/actividad-sesion-tutoria/actividad-sesion-tutoria.component';
import { GeneralidadesTutoriaAcademicaComponent } from './components/generalidades-tutoria-academica/generalidades-tutoria-academica.component';
import { ListaTutoradosComponent } from './pages/lista-tutorados/lista-tutorados.component';
import { HistorialTutoradoComponent } from './pages/historial-tutorado/historial-tutorado.component';
import { InfoGeneralTutoradoComponent } from './pages/info-general-tutorado/info-general-tutorado.component';
import { NewSesionTutoriaObligatoriaComponent } from './pages/new-sesion-tutoria-obligatoria/new-sesion-tutoria-obligatoria.component';
import { FormSesionTutoriaObligatoriaComponent } from './components/form-sesion-tutoria-obligatoria/form-sesion-tutoria-obligatoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EstadoReservasVoluntariasComponent } from './pages/estado-reservas-voluntarias/estado-reservas-voluntarias.component';
import { EstadoReservasObligatoriasComponent } from './pages/estado-reservas-obligatorias/estado-reservas-obligatorias.component';
import { CuadroVistaPreviaReservaObligatoriaComponent } from './components/cuadro-vista-previa-reserva-obligatoria/cuadro-vista-previa-reserva-obligatoria.component';
import { ConfirmationService } from 'primeng/api';
import { DetalleEstadoReservaOComponent } from './components/detalle-estado-reserva-o/detalle-estado-reserva-o.component';
import { LeyendaEstadoReservaComponent } from './components/leyenda-estado-reserva/leyenda-estado-reserva.component';
import { EmailSendService } from '../auth/services/email-send.service';
import { RegistrarHorarioDisponibleComponent } from './pages/registrar-horario-disponible/registrar-horario-disponible.component';
import { DatosTutorComponent } from './pages/datos-tutor/datos-tutor.component';
import { FichaTutoriaVoluntariaComponent } from './pages/ficha-tutoria-voluntaria/ficha-tutoria-voluntaria.component';
import { TablaHistorialTutoradoComponent } from './components/tabla-historial-tutorado/tabla-historial-tutorado.component';


@NgModule({
  declarations: [
    FichaTutoriaObligatoriaComponent,
    DatosTutoradoComponent,
    InputDataComponent,
    HomeComponent,
    ActividadSesionTutoriaComponent,
    GeneralidadesTutoriaAcademicaComponent,
    ListaTutoradosComponent,
    InfoGeneralTutoradoComponent,
    HistorialTutoradoComponent,
    NewSesionTutoriaObligatoriaComponent,
    FormSesionTutoriaObligatoriaComponent,
    CuadroVistaPreviaReservaObligatoriaComponent,
    EstadoReservasVoluntariasComponent,
    EstadoReservasObligatoriasComponent,
    DetalleEstadoReservaOComponent,
    LeyendaEstadoReservaComponent,
    DatosTutorComponent,
    RegistrarHorarioDisponibleComponent,
    TablaHistorialTutoradoComponent,
    FichaTutoriaVoluntariaComponent
  ],
  imports: [
    CommonModule,
    TutoresRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,

  ],
  providers:[    
    ConfirmationService,
    EmailSendService
  ]
})
export class TutoresModule { }
