import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userdatas: any = [];
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    this.db.list('/UserInfo').snapshotChanges()
      .subscribe(user => {
        user.map(data => {
          this.userdatas.push({ id: data.key, value: data.payload.val() });
        });
      });
  }

  getData(id?) {
    return this.userdatas;
  }

  loginAuth(id) {
    this.db.list('/ManageUsers').valueChanges().subscribe(data => {
      data.map(user => {
        if (user['userid'] === id) {
          if (user['status'] !== 'Removed') {
            this.userdatas.find(user => {
              if (user.value['account']['userid'] === id) {
                if (user.value['account']['role'] === "admin") {
                  sessionStorage.setItem('DomainAdmin', id);
                } else {
                  sessionStorage.setItem('DomainUser', id);
                }
                sessionStorage.setItem('username', user.value['firstname']);
                this.router.navigate(['/homePage']);
              }
            });
          } else {
            alert("you don't have permission to signin.");
          }
        }
      });
    });
  }



logOut() {
  this.afAuth.auth.signOut();
  if (sessionStorage.getItem('DomainUser')) {
    sessionStorage.removeItem('DomainUser');
  } else {
    sessionStorage.removeItem('DomainAdmin');
  }
  sessionStorage.removeItem('username');
  this.router.navigate(['']);
}
}
