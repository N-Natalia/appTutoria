import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputDataComponent } from './components/input-data/input-data.component';

import { FichaTutoriaObligatoriaComponent } from './pages/ficha-tutoria-obligatoria/ficha-tutoria-obligatoria.component';
import { ActividadSesionTutoriaComponent } from './components/actividad-sesion-tutoria/actividad-sesion-tutoria.component';
import { DatosTutoradoComponent } from './components/datos-tutorado/datos-tutorado.component';

import { ListaTutoradosComponent } from './pages/lista-tutorados/lista-tutorados.component';
import { HistorialTutoradoComponent } from './pages/historial-tutorado/historial-tutorado.component';
import { InfoGeneralTutoradoComponent } from './pages/info-general-tutorado/info-general-tutorado.component';
import { NewSesionTutoriaObligatoriaComponent } from './pages/new-sesion-tutoria-obligatoria/new-sesion-tutoria-obligatoria.component';
import { EstadoReservasVoluntariasComponent } from './pages/estado-reservas-voluntarias/estado-reservas-voluntarias.component';
import { EstadoReservasObligatoriasComponent } from './pages/estado-reservas-obligatorias/estado-reservas-obligatorias.component';
import { RegistrarHorarioDisponibleComponent } from './pages/registrar-horario-disponible/registrar-horario-disponible.component';
import { DatosTutorComponent } from './pages/datos-tutor/datos-tutor.component';
import { FichaTutoriaVoluntariaComponent } from './pages/ficha-tutoria-voluntaria/ficha-tutoria-voluntaria.component';


const routes: Routes = [
  {
    path: '',
    children: [
     
      { 
        path:'inputData',
        component:InputDataComponent
      },
      { 
        path:'actividadST',
        component:ActividadSesionTutoriaComponent
      },

      { 
        path:'fichaTutoriaObligatoria/:id',
        component:FichaTutoriaObligatoriaComponent
      },
      { 
        path:'fichaTutoriaVoluntaria/:id',
        component:FichaTutoriaVoluntariaComponent,
      },


      { 
        path:'datosTutorado/:id',
        component:DatosTutoradoComponent
      },
      { 
        path:'listaTutorados',
        component: ListaTutoradosComponent
      },
      { 
        path:'historialTutorado/:id',
        component: HistorialTutoradoComponent
      },
      { 
        path:'InfoGeneralTutorado/:id',
        component:InfoGeneralTutoradoComponent
      },
      { 
        path:'registrarHorarioDisponible',
        component: RegistrarHorarioDisponibleComponent
      },
      { 
        path:'newSesionTutoriaObligatoria',
        component: NewSesionTutoriaObligatoriaComponent
      },
      { 
          path:'registrarHorarioDisponible',
          component: RegistrarHorarioDisponibleComponent},
      { 
        path:'estadoReservasVoluntarias',
        component: EstadoReservasVoluntariasComponent
      },
      { 
        path:'estadoReservasObligatorias',
        component: EstadoReservasObligatoriasComponent
      },
      { 
        path:'datosTutor',
        component: DatosTutorComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutoresRoutingModule { }
