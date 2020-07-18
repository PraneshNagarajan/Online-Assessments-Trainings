import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService implements CanActivate{
  constructor(private router:Router, private afAuth:AngularFireAuth){}
  canActivate() {
    if( sessionStorage.getItem('DomainUser') || sessionStorage.getItem('DomainAdmin')) {
       return true;
    } else {
       this.router.navigate(['']);
    } 
  }
}
