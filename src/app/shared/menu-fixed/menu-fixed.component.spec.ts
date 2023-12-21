import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFixedComponent } from './menu-fixed.component';

describe('MenuFixedComponent', () => {
  let component: MenuFixedComponent;
  let fixture: ComponentFixture<MenuFixedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuFixedComponent]
    });
    fixture = TestBed.createComponent(MenuFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
