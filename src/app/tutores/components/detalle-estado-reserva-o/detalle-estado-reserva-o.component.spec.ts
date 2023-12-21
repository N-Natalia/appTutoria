import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstadoReservaOComponent } from './detalle-estado-reserva-o.component';

describe('DetalleEstadoReservaOComponent', () => {
  let component: DetalleEstadoReservaOComponent;
  let fixture: ComponentFixture<DetalleEstadoReservaOComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleEstadoReservaOComponent]
    });
    fixture = TestBed.createComponent(DetalleEstadoReservaOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
