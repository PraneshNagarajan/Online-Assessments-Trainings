import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCatagoryComponent } from './view-catagory.component';

describe('ViewCatagoryComponent', () => {
  let component: ViewCatagoryComponent;
  let fixture: ComponentFixture<ViewCatagoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCatagoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
