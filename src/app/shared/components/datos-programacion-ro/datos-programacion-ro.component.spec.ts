import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosProgramacionROComponent } from './datos-programacion-ro.component';

describe('DatosProgramacionROComponent', () => {
  let component: DatosProgramacionROComponent;
  let fixture: ComponentFixture<DatosProgramacionROComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosProgramacionROComponent]
    });
    fixture = TestBed.createComponent(DatosProgramacionROComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
