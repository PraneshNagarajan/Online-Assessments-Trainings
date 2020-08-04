import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubcatagoryComponent } from './view-subcatagory.component';

describe('ViewSubcatagoryComponent', () => {
  let component: ViewSubcatagoryComponent;
  let fixture: ComponentFixture<ViewSubcatagoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubcatagoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubcatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
