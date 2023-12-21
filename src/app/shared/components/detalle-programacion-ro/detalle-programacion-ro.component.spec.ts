import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProgramacionROComponent } from './detalle-programacion-ro.component';

describe('DetalleProgramacionROComponent', () => {
  let component: DetalleProgramacionROComponent;
  let fixture: ComponentFixture<DetalleProgramacionROComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleProgramacionROComponent]
    });
    fixture = TestBed.createComponent(DetalleProgramacionROComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
