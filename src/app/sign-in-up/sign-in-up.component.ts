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

  constructor(private afAuth: AngularFireAuth, private service: DataService) { 
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
  }

