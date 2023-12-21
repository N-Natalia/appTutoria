import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroVistaPreviaReservaObligatoriaComponent } from './cuadro-vista-previa-reserva-obligatoria.component';

describe('CuadroReservaObligatoriaComponent', () => {
  let component: CuadroVistaPreviaReservaObligatoriaComponent;
  let fixture: ComponentFixture<CuadroVistaPreviaReservaObligatoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuadroVistaPreviaReservaObligatoriaComponent]
    });
    fixture = TestBed.createComponent(CuadroVistaPreviaReservaObligatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
