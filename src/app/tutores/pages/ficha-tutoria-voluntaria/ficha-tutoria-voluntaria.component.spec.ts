import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTutoriaVoluntariaComponent } from './ficha-tutoria-voluntaria.component';

describe('FichaTutoriaVoluntariaComponent', () => {
  let component: FichaTutoriaVoluntariaComponent;
  let fixture: ComponentFixture<FichaTutoriaVoluntariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichaTutoriaVoluntariaComponent]
    });
    fixture = TestBed.createComponent(FichaTutoriaVoluntariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
