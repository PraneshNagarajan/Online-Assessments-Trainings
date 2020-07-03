import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataService } from '../data.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.css']
})
export class SignINUPComponent implements OnInit {
mediaSubscribe: Subscription;
deviceXs;
  constructor(private afAuth: AngularFireAuth, private service: DataService, private mediaObserver: MediaObserver, private mediaChange: MediaChange) { 
  }

  ngOnInit() {
    this.mediaSubscribe = this.mediaObserver.media$.subscribe((device: MediaChange) => {
      this.deviceXs = device.mqAlias === 'xs' ? 80 : 28;
    })
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

