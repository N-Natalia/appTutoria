import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import ValidateForm from 'src/app/auth/helpers/validateForm';
interface TipoReunion {
  name: string;
}

@Component({
  selector: 'app-form-sesion-tutoria-obligatoria',
  templateUrl: './form-sesion-tutoria-obligatoria.component.html',
  styleUrls: ['./form-sesion-tutoria-obligatoria.component.css']
})
export class FormSesionTutoriaObligatoriaComponent implements OnInit{
  
  //semestre: string | undefined;
  //intervaloDuracion: number | undefined;
  //date: Date | undefined;

  tiposReunion: TipoReunion[] | undefined;
  //selectedTipoReunion: TipoReunion | undefined;
 
  //Semestre
  @Input() semestreValue: string | undefined;

  formSesionTutoriaObligatoria: FormGroup = this.fb.group({
    fecha: ['', [Validators.required]],
    horaInicio: ['',[Validators.required]],
    selectedTipoReunion:  ['Presencial',[Validators.required]] ,
    intervaloDuracion: [ ,[Validators.required]] 
  });

  constructor(private fb: FormBuilder,
              private messageService: MessageService){
  }

  ngOnInit(): void {
      this.tiposReunion = [
        { name: 'Presencial' },
        { name: 'Virtual'}
    ];
  }


  areFieldsCompleted(): boolean {
    // Verifica si todos los campos del formulario son válidos y han sido completados
    const controls = this.formSesionTutoriaObligatoria.controls;
    return (
      controls['fecha'].valid &&
      controls['horaInicio'].valid  &&
      controls['intervaloDuracion'].valid
    );
  }

}
