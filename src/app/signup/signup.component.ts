import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CapsValidators } from '../Validators/Caps.validators';
import { IntegerValidators } from '../Validators/integer.validators';
import { SpecialCharacterValidators } from '../Validators/specialCharacter.validators';
import { WhiteSpaceValidators } from '../Validators/whiteSpace.validators';
import { TextValidators } from '../Validators/text.validators';
import { CommonValidators } from '../Validators/common.validators';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MediaObserver, MediaChange} from '@angular/flex-layout';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class SignupComponent implements OnInit {
  isSpinner: boolean;
  panelOpenState: boolean;
  isChecked: boolean;
  mediaSubscribe: Subscription;
  deviceXs;
  deviceStyle;
  questions = [
    { name: 'Who is your favourite person?' },
    { name: 'What is your favourite color?' },
    { name: 'What is your High school name?' },
    { name: 'Who is your favourite sport player?' }
  ]
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private service: DataService, public mediaObserver: MediaObserver, private mediaChange: MediaChange) {

  }
  ngOnInit() {
    this.mediaSubscribe = this.mediaObserver.media$.subscribe((device: MediaChange) => {
      this.deviceXs = device.mqAlias === 'xs' ? '100%' : '30%';
      this.deviceStyle = (device.mqAlias === 'xs') ? 'column' : 'row';
      console.log(this.deviceStyle);
    })
  }  
  firstFormGroup = new FormGroup({
    firstname: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    lastname: new FormControl("", [
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    fathername: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    dob: new FormControl(),
    gender: new FormControl(),
    phone: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      TextValidators.notFoundText,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    email: new FormControl("", [
      Validators.required,
      WhiteSpaceValidators.noSpace,
      CommonValidators.foundEmailCharPattern,
      CommonValidators.foundEmailTextPattern
    ])
  });
  secondFormGroup = new FormGroup({
    flat: new FormControl("", [
      Validators.required,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.foundDashCharacter
    ]),
    street: new FormControl("", [
      Validators.required,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    landmark: new FormControl("", [
      Validators.required,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    city: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    district: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    state: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    country: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    pincode: new FormControl("", [
      Validators.required,
      TextValidators.notFoundText,
      IntegerValidators.foundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
  });
  secondFormGroup1 = new FormGroup({
    flat: new FormControl("", [
      Validators.required,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.foundDashCharacter
    ]),
    street: new FormControl(),
    landmark: new FormControl(),
    city: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    district: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    state: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    country: new FormControl("", [
      Validators.required,
      CapsValidators.firstCaps,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ]),
    pincode: new FormControl("", [
      Validators.required,
      TextValidators.notFoundText,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter
    ])
  });

  secondFormGroup2 = new FormGroup({
    flat: new FormControl({ value: "", disabled: true }),
    street: new FormControl({ value: "", disabled: true }),
    landmark: new FormControl({ value: "", disabled: true }),
    city: new FormControl({ value: "", disabled: true }),
    district: new FormControl({ value: "", disabled: true }),
    state: new FormControl({ value: "", disabled: true }),
    country: new FormControl({ value: "", disabled: true }),
    pincode: new FormControl({ value: "", disabled: true })
  });

  thirdFormGroup = new FormGroup({
    userID: new FormControl("",
      [
        Validators.required,
        WhiteSpaceValidators.noSpace,
        SpecialCharacterValidators.notFoundCharacter
      ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CapsValidators.foundCaps,
      CapsValidators.foundLower,
      IntegerValidators.foundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.foundCharacter
    ]),
    securityQA1: new FormControl(),
    answer1: new FormControl("", [
      Validators.required,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter]),
    securityQA2: new FormControl(),
    answer2: new FormControl("", [
      Validators.required,
      IntegerValidators.notFoundInteger,
      WhiteSpaceValidators.noSpace,
      SpecialCharacterValidators.notFoundCharacter])
  });


 

  onCheckbox() {
    this.isChecked = !this.isChecked;
  }

  get firstname() {
    return this.firstFormGroup.get('firstname');
  }
  get lastname() {
    return this.firstFormGroup.get('lastname');
  }
  get fathername() {
    return this.firstFormGroup.get('fathername');
  }
  get dob() {
    return this.firstFormGroup.get('dob');
  }
  get gender() {
    return this.firstFormGroup.get('gender');
  }
  get phone() {
    return this.firstFormGroup.get('phone');
  }
  get email() {
    return this.firstFormGroup.get('email');
  }
  get Pflat() {
    return this.secondFormGroup.get('flat');
  }
  get Pstreet() {
    return this.secondFormGroup.get('street');
  }
  get Plandmark() {
    return this.secondFormGroup.get('landmark');
  }
  get Pcity() {
    return this.secondFormGroup.get('city');
  }
  get Pdistrict() {
    return this.secondFormGroup.get('district');
  }
  get Pstate() {
    return this.secondFormGroup.get('state');
  }
  get Pcountry() {
    return this.secondFormGroup.get('country');
  }
  get Ppincode() {
    return this.secondFormGroup.get('pincode');
  }
  get Cflat() {
    return this.secondFormGroup.get('flat');
  }
  get Cstreet() {
    return this.secondFormGroup1.get('street');
  }
  get Clandmark() {
    return this.secondFormGroup1.get('landmark');
  }
  get Ccity() {
    return this.secondFormGroup1.get('city');
  }
  get Cdistrict() {
    return this.secondFormGroup1.get('district');
  }
  get Cstate() {
    return this.secondFormGroup1.get('state');
  }
  get Ccountry() {
    return this.secondFormGroup1.get('country');
  }
  get Cpincode() {
    return this.secondFormGroup1.get('pincode');
  }
  get userid() {
    return this.thirdFormGroup.get('userID');
  }
  get password() {
    return this.thirdFormGroup.get('password');
  }
  get qa1() {
    return this.thirdFormGroup.get('securityQA1');
  }
  get answer1() {
    return this.thirdFormGroup.get('answer1');
  }
  get qa2() {
    return this.thirdFormGroup.get('securityQA2');
  }
  get answer2() {
    return this.thirdFormGroup.get('answer2');
  }
  onSave() {
    let Uid = this.userid.value + '@domain.com';
    let Upass = this.password.value;
    let Dob = moment(this.dob.value).format("DD/MM/YYYY");
    this.afAuth.auth.createUserWithEmailAndPassword(Uid, Upass).then(() => {
      this.isSpinner = true;
      this.db.list('/UserList').push({
        id: Uid
      });
      this.db.list('/UserInfo').push({
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        fathername: this.fathername.value,
        dob: Dob,
        gender: this.gender.value,
        phone: this.phone.value,
        email: this.email.value,
        permanentaddress: {
          flat: this.Pflat.value,
          street: this.Pstreet.value,
          landmark: this.Plandmark.value,
          city: this.Pcity.value,
          district: this.Pdistrict.value,
          state: this.Pstate.value,
          country: this.Pcountry.value,
          pincode: this.Ppincode.value
        },
        currentaddress: {
          flat: (this.isChecked) ? this.Pflat.value : this.Cflat.value,
          street: (this.isChecked) ? this.Pstreet.value : this.Cstreet.value,
          landmark: (this.isChecked) ? this.Plandmark.value : this.Clandmark.value,
          city: (this.isChecked) ? this.Pcity.value : this.Ccity.value,
          district: (this.isChecked) ? this.Pdistrict.value : this.Cdistrict.value,
          state: (this.isChecked) ? this.Pstate.value : this.Cstate.value,
          country: (this.isChecked) ? this.Pcountry.value : this.Ccountry.value,
          pincode: (this.isChecked) ? this.Ppincode.value : this.Cpincode.value
        },
        account: {
          userid: this.userid.value+'@domain.com',
          password: this.password.value,
          securityQA1: this.qa1.value,
          securityQA2: this.qa2.value,
          answer1: this.answer1.value,
          answer2: this.answer2.value,
          role: "user"
        }
      });
      this.isSpinner = false;
      alert("Saved data successfully");
      this.router.navigate(['']);
    }).catch(error => {
      alert(error);
    })
  }
}
