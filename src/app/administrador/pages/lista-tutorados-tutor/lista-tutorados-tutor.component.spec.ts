import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTutoradosTutorComponent } from './lista-tutorados-tutor.component';

describe('ListaTutoradosTutorComponent', () => {
  let component: ListaTutoradosTutorComponent;
  let fixture: ComponentFixture<ListaTutoradosTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTutoradosTutorComponent]
    });
    fixture = TestBed.createComponent(ListaTutoradosTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
