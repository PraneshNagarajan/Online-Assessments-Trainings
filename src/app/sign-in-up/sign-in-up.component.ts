import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataService } from '../data.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.css']
})
export class SignINUPComponent implements OnInit {
mediaSubscribe: Subscription;
deviceXs;
  constructor(private afAuth: AngularFireAuth, private auth: AuthService, private mediaObserver: MediaObserver, private mediaChange: MediaChange) { 
  }

  ngOnInit() {
    this.mediaSubscribe = this.mediaObserver.media$.subscribe((device: MediaChange) => {
      this.deviceXs = device.mqAlias === 'xs' ? 80 : 28;
    })
  }

  form = new FormGroup({
  id: new FormControl("", Validators.required),
  password: new FormControl("", Validators.required)
  });

  Authenticate() {
    let id = this.form.get('id').value +'@domain.com';
      this.afAuth.auth.signInWithEmailAndPassword(id, this.form.get('password').value)
      .then( (data) => {
        this.auth.loginAuth(id);  
      }, error => {
         alert(error);
      });
      this.form.reset();
}
  }

