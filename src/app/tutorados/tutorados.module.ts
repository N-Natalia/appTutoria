import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutoradosRoutingModule } from './tutorados-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { InformacionTutorComponent } from './pages/informacion-tutor/informacion-tutor.component';
import { ReservaVoluntariaComponent } from './pages/reserva-voluntaria/reserva-voluntaria.component';
import { ReservaObligatoriaComponent } from './pages/reserva-obligatoria/reserva-obligatoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilaDataComponent } from './components/fila-data/fila-data.component';
import { TablaHorarioComponent } from './components/tabla-horario/tabla-horario.component';
import { DetalleMensajeReservaComponent } from './components/detalle-mensaje-reserva/detalle-mensaje-reserva.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { LeyendaTutoradosComponent } from './components/leyenda-tutorados/leyenda-tutorados.component';


@NgModule({
  declarations: [
    HomeComponent,
    InformacionTutorComponent,
    ReservaVoluntariaComponent,
    ReservaObligatoriaComponent,
    DetalleMensajeReservaComponent,
    FilaDataComponent,
    TablaHorarioComponent,
    HistorialComponent,
    LeyendaTutoradosComponent,
  ],
  imports: [
    CommonModule,
    TutoradosRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
    
  ],
  providers:[
    ConfirmationService,
    MessageService,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TutoradosModule { }
