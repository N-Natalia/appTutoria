import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-programacion-ro',
  templateUrl: './datos-programacion-ro.component.html',
  styleUrls: ['./datos-programacion-ro.component.css']
})
export class DatosProgramacionROComponent {
  @Input() FechaInicio    : string | undefined;
  @Input() FechaFin       : string | undefined;
  @Input() duracion       : number= 0;
  @Input() totalTutorados : number= 0;
  @Input() semestre       : string = "";
  @Input() tipoReunion    : string = "";

 

}
