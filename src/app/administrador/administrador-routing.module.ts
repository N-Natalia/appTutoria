import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistribucionActualizadaComponent } from './pages/distribucion-actualizada/distribucion-actualizada.component';
import { ListaTutoradosTutorComponent } from './pages/lista-tutorados-tutor/lista-tutorados-tutor.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { ImportarNuevaCargaComponent } from './pages/importar-nueva-carga/importar-nueva-carga.component';
import { HistorialTutoradoComponent } from './pages/historial-tutorado/historial-tutorado.component';
import { NuevaTutoriaObligatoriaComponent } from './pages/nueva-tutoria-obligatoria/nueva-tutoria-obligatoria.component';

const routes: Routes = [
  {
    path: '',
    children: [

      { path:'listTutores',component: DistribucionActualizadaComponent},
      { path:'nuevaTutoriaObligatoria',component:NuevaTutoriaObligatoriaComponent},    
      { path:'listTutoradosTutor/:id',component:ListaTutoradosTutorComponent},    
      { path:'reportes',component:ReportesComponent},
      { path:'nuevaDistribucion',component:ImportarNuevaCargaComponent},
      { path:'historialTutorado/:id',component:HistorialTutoradoComponent}, 
  
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }

// ===========================PPP1 original=============================