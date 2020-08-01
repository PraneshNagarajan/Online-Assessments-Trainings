import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssessmentsComponent } from './manage-assessments.component';

describe('ManageAssessmentsComponent', () => {
  let component: ManageAssessmentsComponent;
  let fixture: ComponentFixture<ManageAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
