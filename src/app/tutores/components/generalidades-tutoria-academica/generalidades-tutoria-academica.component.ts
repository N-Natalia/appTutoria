import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generalidades-tutoria-academica',
  templateUrl: './generalidades-tutoria-academica.component.html',
  styleUrls: ['./generalidades-tutoria-academica.component.css']
})
export class GeneralidadesTutoriaAcademicaComponent {
  
  @Input() Semestre: string="" ;
  @Input() Fecha: string="" ;

}
