import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaEstadoReservaComponent } from './leyenda-estado-reserva.component';

describe('LeyendaEstadoReservaComponent', () => {
  let component: LeyendaEstadoReservaComponent;
  let fixture: ComponentFixture<LeyendaEstadoReservaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeyendaEstadoReservaComponent]
    });
    fixture = TestBed.createComponent(LeyendaEstadoReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
