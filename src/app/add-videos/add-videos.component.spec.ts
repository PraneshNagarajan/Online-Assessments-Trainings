import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideosComponent } from './add-videos.component';

describe('AddVideosComponent', () => {
  let component: AddVideosComponent;
  let fixture: ComponentFixture<AddVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
