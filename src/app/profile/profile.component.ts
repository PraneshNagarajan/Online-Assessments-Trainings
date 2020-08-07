import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CapsValidators } from '../Validators/Caps.validators';
import { IntegerValidators } from '../Validators/integer.validators';
import { SpecialCharacterValidators } from '../Validators/specialCharacter.validators';
import { WhiteSpaceValidators } from '../Validators/whiteSpace.validators';
import { TextValidators } from '../Validators/text.validators';
import { CommonValidators } from '../Validators/common.validators';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MediaObserver, MediaChange} from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class ProfileComponent implements OnInit {
    isSpinner: boolean;
    panelOpenState: boolean;
    isChecked: boolean;
    mediaSubscribe: Subscription;
    deviceXs;
    deviceStyle;
    profileDatas = [];
    profileData = [];
    loggedUser: string;
    userName: string;

    constructor(private db: AngularFireDatabase, private router: Router, public mediaObserver: MediaObserver, private mediaChange: MediaChange) {    
      if (sessionStorage.getItem('DomainAdmin')) {
        this.loggedUser = sessionStorage.getItem('DomainAdmin');
      } else {
        this.loggedUser = sessionStorage.getItem('DomainUser')
      }
      this.userName = sessionStorage.getItem('username')
      this.db.list('/UserInfo').snapshotChanges().subscribe(datas => {
        datas.map(data => {
          this.profileDatas.push({key: data.key, value: data.payload.val()});
        });
        this.profileDatas.map(datas => {
          if(datas['value']['account']['userid'] === this.loggedUser) {
            this.profileData.push(datas);
          }
        });
        this.profileData.map(user => {
          this.firstname.setValue(user['value']['firstname']);
          this.lastname.setValue(user['value']['lastname']);
          this.fathername.setValue(user['value']['fathername']);
          this.dob.setValue(user['value']['dob']);
          this.gender.setValue(user['value']['gender']);
        });
      });
    }
    ngOnInit() {
      this.mediaSubscribe = this.mediaObserver.media$.subscribe((device: MediaChange) => {
        this.deviceXs = device.mqAlias === 'xs' ? '100%' : '30%';
        this.deviceStyle = (device.mqAlias === 'xs') ? 'column' : 'row';
      })
    }  
    firstFormGroup = new FormGroup({
      firstname: new FormControl({ value: "", disabled: true }),
      lastname: new FormControl({ value: "", disabled: true }),
      fathername: new FormControl({ value: "", disabled: true }),
      dob: new FormControl({ value: "", disabled: true }),
      gender: new FormControl({ value: "", disabled: true }),
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
    
    onSave() {
        this.db.object('/UserInfo/' + this.profileData[0]['key']).update({
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
          }
        });
        alert("Updated data successfully");
        this.router.navigate(['']);
    }
  }
  