import { Component, Input, OnInit } from '@angular/core';


interface ProgramacionMostrar {
  HoraInicio              :   Date;
  HoraIntervalo           :   string;
  Duracion                :   number;
  EstadoReserva           :   boolean; 
}

@Component({
  selector: 'app-cuadro-vista-previa-reserva-obligatoria',
  templateUrl: './cuadro-vista-previa-reserva-obligatoria.component.html',
  styleUrls: ['./cuadro-vista-previa-reserva-obligatoria.component.css']
})
export class CuadroVistaPreviaReservaObligatoriaComponent implements OnInit{
  // Validar fecha, no permitir fechas pasadas
  // Validar  intervalo duracion no debe ser negativo.
  @Input() cantidadFilasTabla: number | undefined;
  @Input() Duracion: number | undefined;
  @Input() HoraInicio: Date | undefined;

  filas: ProgramacionMostrar[] = [];

  constructor(){
    //this.generarFilas();

  }
  ngOnInit(): void {
    this.generarFilas();
  }


  generarFilas(): void {
    if (this.cantidadFilasTabla && this.Duracion && this.HoraInicio) {
      this.filas = [];

      for (let i = 0; i < this.cantidadFilasTabla; i++) {
        const horaInicio = new Date(this.HoraInicio);
        horaInicio.setMinutes(horaInicio.getMinutes() + i * this.Duracion);

        const horaFin = new Date(horaInicio);
        horaFin.setMinutes(horaFin.getMinutes() + this.Duracion);

        const fila: ProgramacionMostrar = {
          HoraInicio: horaInicio,
          HoraIntervalo: this.formatoHora(horaInicio) + ' - ' + this.formatoHora(horaFin),
          Duracion: this.Duracion,
          EstadoReserva: false // Puedes ajustar el estado de reserva según tus necesidades
        };

        this.filas.push(fila);
      }
    }
  }

  formatoHora(fecha: Date): string {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas > 12 ? horas - 12 : horas;

    return `${hora12}:${minutos < 10 ? '0' : ''}${minutos} ${ampm}`;
  }
}

