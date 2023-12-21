import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribucionActualizadaComponent } from './distribucion-actualizada.component';

describe('DistribucionActualizadaComponent', () => {
  let component: DistribucionActualizadaComponent;
  let fixture: ComponentFixture<DistribucionActualizadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistribucionActualizadaComponent]
    });
    fixture = TestBed.createComponent(DistribucionActualizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
