import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignINUPComponent } from './sign-in-up.component';

describe('SignINUPComponent', () => {
  let component: SignINUPComponent;
  let fixture: ComponentFixture<SignINUPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignINUPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignINUPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
