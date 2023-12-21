import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSesionTutoriaObligatoriaComponent } from './new-sesion-tutoria-obligatoria.component';

describe('NewSesionTutoriaObligatoriaComponent', () => {
  let component: NewSesionTutoriaObligatoriaComponent;
  let fixture: ComponentFixture<NewSesionTutoriaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewSesionTutoriaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(NewSesionTutoriaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
