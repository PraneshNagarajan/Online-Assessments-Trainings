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
    this.notification = [];
    this.notifications = [];
    this.db.list("/notification").snapshotChanges()
      .subscribe( datas => {
        datas.map( data => {
          this.notifications.push({key: data.key, value: data.payload.val()});
      });
      this.notifications.map( data => {
        this.notify = data['value']['users'];
        let j = 0;
          this.notify.map(user => {
            if (user['id'] === this.loggedUser) {
              if (user['status'] === "Unread") {
                ++j;
              }
              this.notification.push({
                status: user['status'],
                date: data['value']['date'],
                time: data['value']['time'],
                duration: data['value']['duration'],
                name: data['value']['name'],
                assessment_key: data['value']['key'],
                title: data['value']['title'],
                scheduled_by: data['value']['scheduled_by'],
                index: j,
                table_key: data['key']
              });
            }
          });
      });
      });
      return this.notification;
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
