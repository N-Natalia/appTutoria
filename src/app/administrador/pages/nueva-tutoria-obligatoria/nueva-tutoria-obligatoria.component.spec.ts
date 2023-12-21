import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaTutoriaObligatoriaComponent } from './nueva-tutoria-obligatoria.component';

describe('NuevaTutoriaObligatoriaComponent', () => {
  let component: NuevaTutoriaObligatoriaComponent;
  let fixture: ComponentFixture<NuevaTutoriaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaTutoriaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(NuevaTutoriaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
