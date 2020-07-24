import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
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
ngOnInit() {

}
  getAssessment(name) {
    this.assessment = [];
    this.db.list('/AssessmentsData/' + name).snapshotChanges().subscribe(ques => {
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
    }, error => alert("It is not Valid Key. Please Enter Valid Assessment Key. \n key starts with '-'"));
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
          sessionStorage.setItem('DomainAdmin', id);
        } else {
          sessionStorage.setItem('DomainUser', id);
        }
        sessionStorage.setItem('username', user.value['firstname']);
        this.router.navigate(['/homePage']);
      }
      sessionStorage
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
