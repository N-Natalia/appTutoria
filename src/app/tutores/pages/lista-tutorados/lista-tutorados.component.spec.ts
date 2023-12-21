import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTutoradosComponent } from './lista-tutorados.component';

describe('ListaTutoradosComponent', () => {
  let component: ListaTutoradosComponent;
  let fixture: ComponentFixture<ListaTutoradosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTutoradosComponent]
    });
    fixture = TestBed.createComponent(ListaTutoradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
