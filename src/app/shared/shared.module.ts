import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { PrimengModule } from './primeng/primeng.module';
import { BarraMenuComponent } from './barra-menu/barra-menu.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { MenuFixedComponent } from './menu-fixed/menu-fixed.component';
import { AccesoDenegadoComponent } from './acceso-denegado/acceso-denegado.component';
import { LeyendaComponent } from './components/leyenda/leyenda.component';
import { DatosTutoradosHistorialComponent } from './components/datos-tutorados-historial/datos-tutorados-historial.component';
import { DetalleProgramacionROComponent } from './components/detalle-programacion-ro/detalle-programacion-ro.component';
import { DatosProgramacionROComponent } from './components/datos-programacion-ro/datos-programacion-ro.component';



@NgModule({
  declarations: [
    BarraMenuComponent,
    HeaderComponent,
    MenuFixedComponent,
    AccesoDenegadoComponent,
    LeyendaComponent,
    DatosTutoradosHistorialComponent,
    DetalleProgramacionROComponent,
    DatosProgramacionROComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PrimengModule,
    FormsModule,
  ],
  exports:[
    HttpClientModule,
    PrimengModule,
    BarraMenuComponent,
    HeaderComponent,
    FormsModule,
    LeyendaComponent,
    DetalleProgramacionROComponent,
    DatosTutoradosHistorialComponent,
    DatosProgramacionROComponent
  ]
})
export class SharedModule { }
