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
  k;
  userdatas: any = [];
  assessmentlist = [];
  assessments: any = [];
  assessment: any = [];
  loggedUser: string;
  notification = [];
  notifications = [];
  notify: any;
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }      
  }

  getNotifications(count?: boolean) {
    
      return this.notification;
  }

  getAssessment(name) {
    this.assessment = [];
    this.db.list('/AssessmentDatas/' + name).snapshotChanges().subscribe(ques => {
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
}
