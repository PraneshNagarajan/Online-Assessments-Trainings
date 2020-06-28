import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService implements CanActivate{
  constructor(private router:Router, private afAuth:AngularFireAuth){}
  canActivate() {
    if( localStorage.getItem('DomainUser') || localStorage.getItem('DomainAdmin')) {
       return true;
    } else {
       this.router.navigate(['']);
    }
  }
}
