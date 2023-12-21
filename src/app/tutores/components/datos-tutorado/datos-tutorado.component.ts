import { Component, Input } from '@angular/core';
import { Tutorado } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
  selector: 'app-datos-tutorado',
  templateUrl: './datos-tutorado.component.html',
  styleUrls: ['./datos-tutorado.component.css']
})
export class DatosTutoradoComponent {
  @Input() Tutorado!: Tutorado ;
}
