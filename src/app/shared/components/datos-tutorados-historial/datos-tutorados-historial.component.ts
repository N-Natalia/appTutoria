import { Component, Input } from '@angular/core';
import { Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-datos-tutorados-historial',
  templateUrl: './datos-tutorados-historial.component.html',
  styleUrls: ['./datos-tutorados-historial.component.css']
})
export class DatosTutoradosHistorialComponent {
  @Input() Tutorado!: Tutorado ;

}
