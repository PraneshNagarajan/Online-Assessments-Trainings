import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.css']
})
export class SignINUPComponent implements OnInit {
  isSuccess: boolean;
  isSuccess1: boolean;
  isSpinner: boolean;
  user: any;
  datas = [];

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private service: DataService) { 
  }

  ngOnInit(): void {
  }
  Authenticate(cred) {
    let Uid = cred.value.id+'@domain.com';
      this.afAuth.auth.signInWithEmailAndPassword(Uid, cred.value.password)
      .then( () => {
        this.service.loginAuth(Uid);
        
      }, error => {
         alert(error);
      });
}

  save(data) {
    let Uid = data.value.id+'@domain.com';
    let Dob = moment(data.value.dob).format("DD/MM/YYYY");
    this.afAuth.auth.createUserWithEmailAndPassword(Uid, data.value.password).then( () => {
      this.isSpinner = true;
      this.db.list('/UserTable').push({
        name: data.value.Name,
        fname: data.value.FName,
        dob: Dob,
        gender: data.value.gender,
        id: Uid,
        password: data.value.password
      });
      this.isSpinner = false;
      this.isSuccess1 = true;
    }).catch( error => {
      alert(error);
    })
  }

}
