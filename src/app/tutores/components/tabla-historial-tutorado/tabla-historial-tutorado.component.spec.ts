import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistorialTutoradoComponent } from './tabla-historial-tutorado.component';

describe('TablaHistorialTutoradoComponent', () => {
  let component: TablaHistorialTutoradoComponent;
  let fixture: ComponentFixture<TablaHistorialTutoradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaHistorialTutoradoComponent]
    });
    fixture = TestBed.createComponent(TablaHistorialTutoradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
