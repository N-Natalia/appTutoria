import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTutoriaObligatoriaComponent } from './ficha-tutoria-obligatoria.component';

describe('FichaTutoriaComponent', () => {
  let component: FichaTutoriaObligatoriaComponent;
  let fixture: ComponentFixture<FichaTutoriaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichaTutoriaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(FichaTutoriaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
