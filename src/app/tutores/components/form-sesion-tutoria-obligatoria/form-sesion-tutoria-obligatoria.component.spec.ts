import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSesionTutoriaObligatoriaComponent } from './form-sesion-tutoria-obligatoria.component';

describe('FormSesionTutoriaObligatoriaComponent', () => {
  let component: FormSesionTutoriaObligatoriaComponent;
  let fixture: ComponentFixture<FormSesionTutoriaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSesionTutoriaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(FormSesionTutoriaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
