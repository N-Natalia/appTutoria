import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaObligatoriaComponent } from './reserva-obligatoria.component';

describe('ReservaObligatoriaComponent', () => {
  let component: ReservaObligatoriaComponent;
  let fixture: ComponentFixture<ReservaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(ReservaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
