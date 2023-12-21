import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHorarioComponent } from './tabla-horario.component';

describe('TablaHorarioComponent', () => {
  let component: TablaHorarioComponent;
  let fixture: ComponentFixture<TablaHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaHorarioComponent]
    });
    fixture = TestBed.createComponent(TablaHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
