import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadSesionTutoriaComponent } from './actividad-sesion-tutoria.component';

describe('ActividadSesionTutoriaComponent', () => {
  let component: ActividadSesionTutoriaComponent;
  let fixture: ComponentFixture<ActividadSesionTutoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadSesionTutoriaComponent]
    });
    fixture = TestBed.createComponent(ActividadSesionTutoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
