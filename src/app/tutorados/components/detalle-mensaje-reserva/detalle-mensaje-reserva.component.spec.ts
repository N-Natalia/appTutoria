import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMensajeReservaComponent } from './detalle-mensaje-reserva.component';

describe('DetalleMensajeReservaVoluntariaComponent', () => {
  let component: DetalleMensajeReservaComponent;
  let fixture: ComponentFixture<DetalleMensajeReservaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMensajeReservaComponent]
    });
    fixture = TestBed.createComponent(DetalleMensajeReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
