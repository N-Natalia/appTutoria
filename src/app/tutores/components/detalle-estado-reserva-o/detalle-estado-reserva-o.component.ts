import { Component, Input } from '@angular/core';
import { Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-detalle-estado-reserva-o',
  templateUrl: './detalle-estado-reserva-o.component.html',
  styleUrls: ['./detalle-estado-reserva-o.component.css']
})
export class DetalleEstadoReservaOComponent {
  @Input() tutoradoObj!: Tutorado;
  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

}
