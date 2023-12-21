import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoReservasVoluntariasComponent } from './estado-reservas-voluntarias.component';

describe('EstadoReservasVoluntariasComponent', () => {
  let component: EstadoReservasVoluntariasComponent;
  let fixture: ComponentFixture<EstadoReservasVoluntariasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoReservasVoluntariasComponent]
    });
    fixture = TestBed.createComponent(EstadoReservasVoluntariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
