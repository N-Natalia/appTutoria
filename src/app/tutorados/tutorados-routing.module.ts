import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InformacionTutorComponent } from './pages/informacion-tutor/informacion-tutor.component';
import { ReservaVoluntariaComponent } from './pages/reserva-voluntaria/reserva-voluntaria.component';
import { ReservaObligatoriaComponent } from './pages/reserva-obligatoria/reserva-obligatoria.component';
import { HistorialComponent } from './pages/historial/historial.component';

const routes: Routes = [
  {
    path: '',
    children: [
      
      { path:'infoTutor',component: InformacionTutorComponent},
      { path:'reservaVoluntaria',component: ReservaVoluntariaComponent},
      { path:'reservaObligatoria',component: ReservaObligatoriaComponent},
      { path:'historial',component: HistorialComponent},
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutoradosRoutingModule { }
