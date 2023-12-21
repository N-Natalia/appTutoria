import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarNuevaCargaComponent } from './importar-nueva-carga.component';

describe('ImportarNuevaCargaComponent', () => {
  let component: ImportarNuevaCargaComponent;
  let fixture: ComponentFixture<ImportarNuevaCargaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportarNuevaCargaComponent]
    });
    fixture = TestBed.createComponent(ImportarNuevaCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
