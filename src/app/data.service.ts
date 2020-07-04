import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userdatas: any = [];
  assesment1: any = [];
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) { 
    this.db.list('/UserTable').snapshotChanges()
    .subscribe(user => {
      user.map(data => {
        this.userdatas.push({ id: data.key, value: data.payload.val() });
      });
    });

    this.db.list('/Assesment1').snapshotChanges().subscribe(ques => {
      let i = 0;
      ques.map(data => {
        this.assesment1.push({ index: ++i, assesment1: data.payload.val() });
      })
    })
   }
   
  getData(id?) {
    return this.userdatas;
  }

  getAssesment1() {
    return this.assesment1;
  }
  loginAuth(id) {
    this.userdatas.find( user => { 
      if(user.value['account']['userid'] === id) {
        if(user.value['account']['role'] === "admin") {
          localStorage.setItem('DomainAdmin', id);
        } else {
          localStorage.setItem('DomainUser', id);
        }
        this.router.navigate(['/main']);
      }
    });
  }
}
