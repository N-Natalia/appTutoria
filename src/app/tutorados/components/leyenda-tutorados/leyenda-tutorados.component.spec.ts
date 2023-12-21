import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaTutoradosComponent } from './leyenda-tutorados.component';

describe('LeyendaTutoradosComponent', () => {
  let component: LeyendaTutoradosComponent;
  let fixture: ComponentFixture<LeyendaTutoradosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeyendaTutoradosComponent]
    });
    fixture = TestBed.createComponent(LeyendaTutoradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
