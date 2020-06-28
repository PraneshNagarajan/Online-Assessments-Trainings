import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignupComponent implements OnInit {
  questions = [
    { name: 'Who is your favourite person?'},
    { name: 'what is favourite color?'},
    { name: 'what is your High school name?'},
    { name: 'Who is your sport player?'}
  ]
  firstFormGroup = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    fathername: new FormControl(),
    dob: new FormControl(),
    gender: new FormControl()
  });
  secondFormGroup = new FormGroup({
    userAddress: new FormControl('', Validators.required),
  });
 thirdFormGroup = new FormGroup({
  userID: new FormControl(),
  password: new FormControl(),
  securityQA:new FormControl()
 });
  constructor() {}

  ngOnInit() {
  }
}
