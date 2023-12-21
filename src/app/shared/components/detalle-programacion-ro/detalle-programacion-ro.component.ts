import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-programacion-ro',
  templateUrl: './detalle-programacion-ro.component.html',
  styleUrls: ['./detalle-programacion-ro.component.css']
})
export class DetalleProgramacionROComponent {
  @Input() fecha    : string | undefined;
  @Input() hora!       : Date ;
  @Input() duracion       : number= 0;
  @Input() totalTutorados : number= 0;
 

  diaOfFecha(fecha : string){    
    let [dia, mes, ano] = fecha.split('/');
    let fechaCorrecta = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

    return fechaCorrecta.toLocaleDateString('es-ES', { weekday: 'long' });
  }

  calcularHoraFinal(horaInicio: Date, duracion: number, totalTutorados: number): string {
    // Convertir la duración de minutos a milisegundos
    const duracionMs = duracion * 60 * 1000;
    
    // Calcular la hora final sumando la duración multiplicada por el total de tutorados a la hora de inicio
    const horaFinal = new Date(horaInicio.getTime() + (duracionMs * totalTutorados));
    
    // Formatear la hora de inicio y la hora final como cadenas de texto
    
    const horaInicioStr = horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const horaFinalStr = horaFinal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Devolver la cadena de texto que representa la hora de inicio y la hora final
    return horaInicioStr+' - '+horaFinalStr;
  }
}
