import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoReservasObligatoriasComponent } from './estado-reservas-obligatorias.component';

describe('EstadoReservasObligatoriasComponent', () => {
  let component: EstadoReservasObligatoriasComponent;
  let fixture: ComponentFixture<EstadoReservasObligatoriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoReservasObligatoriasComponent]
    });
    fixture = TestBed.createComponent(EstadoReservasObligatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
