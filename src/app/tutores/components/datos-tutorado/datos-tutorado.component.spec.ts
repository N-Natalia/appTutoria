import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTutoradoComponent } from './datos-tutorado.component';

describe('DatosTutoradoComponent', () => {
  let component: DatosTutoradoComponent;
  let fixture: ComponentFixture<DatosTutoradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosTutoradoComponent]
    });
    fixture = TestBed.createComponent(DatosTutoradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
