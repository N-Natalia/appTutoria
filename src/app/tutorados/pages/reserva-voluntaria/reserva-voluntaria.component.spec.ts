import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaVoluntariaComponent } from './reserva-voluntaria.component';

describe('ReservaVoluntariaComponent', () => {
  let component: ReservaVoluntariaComponent;
  let fixture: ComponentFixture<ReservaVoluntariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservaVoluntariaComponent]
    });
    fixture = TestBed.createComponent(ReservaVoluntariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
