import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fila-data',
  templateUrl: './fila-data.component.html',
  styleUrls: ['./fila-data.component.css']
})
export class FilaDataComponent {
  @Input() label: string = "";
  @Input() value: any;


}
