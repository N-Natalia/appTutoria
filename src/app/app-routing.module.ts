import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { AccesoDenegadoComponent } from './shared/acceso-denegado/acceso-denegado.component';

const routes: Routes = [ 
  {
    path: 'accesoDenegado',
    component: AccesoDenegadoComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'tutores',
    loadChildren: () => import('./tutores/tutores.module').then( m => m.TutoresModule ),
    canActivate: [authGuard,roleGuard],
    data: { role: 'tutor' }
  },
  {
    path: 'tutorados',
    loadChildren: () => import('./tutorados/tutorados.module').then( m => m.TutoradosModule ),
    canActivate: [authGuard,roleGuard],
    data: { role: 'tutorado' }
  }
  ,
  {
    path: 'administrador',
    loadChildren: () => import('./administrador/administrador.module').then( m => m.AdministradorModule ),
    canActivate: [authGuard,roleGuard],
    data: { role: 'admin' }
  },
  {
    path:'**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
