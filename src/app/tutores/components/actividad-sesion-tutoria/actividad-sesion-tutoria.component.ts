import { AfterViewInit, Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-actividad-sesion-tutoria',
  templateUrl: './actividad-sesion-tutoria.component.html',
  styleUrls: ['./actividad-sesion-tutoria.component.css']
})
export class ActividadSesionTutoriaComponent   {
  
  @Input() dimension1: string = "academico";
  @Input() dimension2: string = "profesional";
  @Input() dimension3: string = "personal";

  


  

}
