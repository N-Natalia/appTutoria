import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AdministradorRoutingModule } from './administrador-routing.module';
import { HomeComponent } from './home/home.component';
import { ListaTutoradosTutorComponent } from './pages/lista-tutorados-tutor/lista-tutorados-tutor.component';
import { DistribucionActualizadaComponent } from './pages/distribucion-actualizada/distribucion-actualizada.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { SharedModule } from '../shared/shared.module';
import { ImportarNuevaCargaComponent } from './pages/importar-nueva-carga/importar-nueva-carga.component';
import { HistorialTutoradoComponent } from './pages/historial-tutorado/historial-tutorado.component';
import { ConfirmationService } from 'primeng/api';
import { NuevaTutoriaObligatoriaComponent } from './pages/nueva-tutoria-obligatoria/nueva-tutoria-obligatoria.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,    
    ListaTutoradosTutorComponent,
    DistribucionActualizadaComponent,
    ReportesComponent,
    ImportarNuevaCargaComponent,
    HistorialTutoradoComponent,
    NuevaTutoriaObligatoriaComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers:
  [ConfirmationService]

  
})
export class AdministradorModule { }
