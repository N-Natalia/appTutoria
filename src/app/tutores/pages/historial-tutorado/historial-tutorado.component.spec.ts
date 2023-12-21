import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialTutoradoComponent } from './historial-tutorado.component';

describe('HistorialTutoradoComponent', () => {
  let component: HistorialTutoradoComponent;
  let fixture: ComponentFixture<HistorialTutoradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialTutoradoComponent]
    });
    fixture = TestBed.createComponent(HistorialTutoradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
