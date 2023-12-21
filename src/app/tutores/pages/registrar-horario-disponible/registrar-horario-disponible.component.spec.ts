import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarHorarioDisponibleComponent } from './registrar-horario-disponible.component';

describe('RegistrarHorarioDisponibleComponent', () => {
  let component: RegistrarHorarioDisponibleComponent;
  let fixture: ComponentFixture<RegistrarHorarioDisponibleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarHorarioDisponibleComponent]
    });
    fixture = TestBed.createComponent(RegistrarHorarioDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
