import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  i = 0;
  userdatas: any = [];
  assessmentlist = [];
  assessments: any = [];
  assessment: any = [];
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    this.db.list('/UserInfo').snapshotChanges()
      .subscribe(user => {
        user.map(data => {
          this.userdatas.push({ id: data.key, value: data.payload.val() });
        });
      });
  }

getAssessment(name){
      this.db.list('/AssessmentsData/'+name).snapshotChanges().subscribe(ques => {
        let oFlag = 0;
        let eFlag = 0;
        let shuffle = moment().format("mm:ss");
        ques.map(data => {
          this.assessments.push({ data: data.payload.val() });
        });
        (Number(shuffle.split(':')[0]) % 2 === 0) ? ++eFlag : ++oFlag;
        (Number(shuffle.split(':')[1]) % 2 === 0) ? ++eFlag : ++oFlag;
        if (eFlag > oFlag) {
          this.eloop(ques);
          this.oloop(ques);
        }
        else if (oFlag > eFlag) {
          this.oloop(ques);
          this.eloop(ques);
        } else {
          this.oeloop(ques);
        }
      });
      return this.assessment;
    } 




  eloop(ques) {
    for (let j = 0; j < ques.length; j++) {
      if (j % 2 === 0) {
        this.assessment.push({ index: ++this.i, assessment: this.assessments[j]['data'] });
      }
    }
  }

  oloop(ques) {
    for (let j = 0; j < ques.length; j++) {
      if (j % 2 !== 0) {
        this.assessment.push({ index: ++this.i, assessment: this.assessments[j]['data'] });
      }
    }
  }

  oeloop(ques) {
    for (let j = 0; j < ques.length; j++) {
      if ((j % 3 === 0)) {
        this.assessment.push({ index: ++this.i, assessment: this.assessments[j]['data'] });
      }
    }
    for (let j = 0; j < ques.length; j++) {
      if ((j % 3 !== 0)) {
        this.assessment.push({ index: ++this.i, assessment: this.assessments[j]['data'] });
      }
    }
  }


  getData(id?) {
    return this.userdatas;
  }



  loginAuth(id) {
    this.userdatas.find(user => {
      if (user.value['account']['userid'] === id) {
        if (user.value['account']['role'] === "admin") {
          localStorage.setItem('DomainAdmin', id);
        } else {
          localStorage.setItem('DomainUser', id);
        }
        localStorage.setItem('username', user.value['firstname']);
        this.router.navigate(['/homePage']);
      }
    });
  }

  logOut() {
    this.afAuth.auth.signOut();
    if (localStorage.getItem('DomainUser')) {
      localStorage.removeItem('DomainUser');
    } else {
      localStorage.removeItem('DomainAdmin');
    }
    localStorage.removeItem('username');
    this.router.navigate(['']);
  }
}
