import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilaDataComponent } from './fila-data.component';

describe('FilaDataComponent', () => {
  let component: FilaDataComponent;
  let fixture: ComponentFixture<FilaDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilaDataComponent]
    });
    fixture = TestBed.createComponent(FilaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
