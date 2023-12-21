import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.css']
})
export class InputDataComponent  {
  @Input() label: string= "";
  @Input() placeHolder: string ="";
  @Input() formControlName: string = "";
  

}
