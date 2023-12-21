import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralidadesTutoriaAcademicaComponent } from './generalidades-tutoria-academica.component';

describe('GeneralidadesTutoriaAcademicaComponent', () => {
  let component: GeneralidadesTutoriaAcademicaComponent;
  let fixture: ComponentFixture<GeneralidadesTutoriaAcademicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralidadesTutoriaAcademicaComponent]
    });
    fixture = TestBed.createComponent(GeneralidadesTutoriaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
