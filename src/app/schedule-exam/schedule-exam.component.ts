import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';
import 'moment-duration-format';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-schedule-exam',
  templateUrl: './schedule-exam.component.html',
  styleUrls: ['./schedule-exam.component.css']
})
export class ScheduleExamComponent implements OnInit {
  media: Subscription;
  top;
  size: number;
  bottom: string;
  userList = [];
  key;
  isAvailable: boolean;
  assessmentList = [];
  enagagedUsers = "";
  users = []
  loggedUser;
  assessmentSchduledData = [];
  users1 = [];
  confirmed: boolean = true;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.db.list('/UserList').snapshotChanges().subscribe(users => {
      users.map(user => {
        this.userList.push(user.payload.val());
      });
    });
    this.db.list('/AssessmentList').snapshotChanges().subscribe(assessments => {
      assessments.map(assessment => {
        this.assessmentList.push(assessment.payload.val());
      });
    });
    this.db.list("/AssessmentUserStatusTracker").snapshotChanges().subscribe(data => {
      data.map(assessmentData => {
        this.assessmentSchduledData.push(assessmentData.payload.val());
      });
      console.log(this.assessmentSchduledData.length);
    }, error => console.log(error));
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = 90;
        this.top = "50%";
        this.bottom = "100%";
      }
      else if (change.mqAlias === 'sm') {
        this.size = 90;
        this.top = "50%"
        this.bottom = "100%"
      }
      else if (change.mqAlias === 'md') {
        this.size = 80;
        this.top = "10%"
        this.bottom = "100%"
      }
      else {
        this.size = 80;
        this.top = "10%"
        this.bottom = "100%"
      }
    });
  }

  schedule = new FormGroup({
    assessment: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    time: new FormControl("", Validators.required),
    duration: new FormControl("", Validators.required),
    users: new FormControl("", Validators.required)
  });

  onSchedule() {
    let i = 0;
    let Ctime = moment().format("MM/DD/YYYY HH:mm:ss");
    let Sdate = moment(this.schedule.get('date').value).format('MM/DD/YYYY');
    let Stype = this.schedule.get('assessment').value;
    let Stime = this.schedule.get('time').value;
    let Sduration = this.schedule.get('duration').value * 60;
    if (this.assessmentSchduledData.length > 0) {
      this.assessmentSchduledData.map(data => {
        ++i;
        console.log(i);
        let Users: any[] = data['scheduled_info']['users'];
        let date = data['scheduled_info']['date'];
        let time = data['scheduled_info']['time'];
        let duration = data['scheduled_info']['duration'];
        if (data.status === "Unstarted") {
          this.isAvailable = true;
          let addTime;
          let subTime;
          if (Number(duration) < 3600) {
            addTime = moment(time, "HH:mm:ss").add("00:" + moment.duration(duration + 300, "seconds").format("HH:mm:ss")).format("HH:mm:ss");
          } else {
            addTime = moment(time, "HH:mm:ss").add(moment.duration(duration + 300, "seconds").format("HH:mm:ss")).format("HH:mm:ss");
          }
          if (Sduration < 3600) {
            subTime = moment(time, "HH:mm:ss").subtract("00:" + moment.duration(Sduration + 300, "seconds").format("HH:mm:ss")).format("HH:mm:ss");
          } else {
            subTime = moment(time, "HH:mm:ss").subtract(moment.duration(Sduration + 300, "seconds").format("HH:mm:ss")).format("HH:mm:ss");
          }
          let name = (data.assessment_id as string).split('_')[3];
          Users.map(user => {
            this.users.map(user1 => {
              if (user['id'] === user1['id']) {
                if ((date === Sdate)) {
                  if (moment(Stime, "HH:mm:ss").isBetween(moment(subTime, "HH:mm:ss"), moment(addTime, "HH:mm:ss"))) {
                    this.confirmed = false;
                    this.enagagedUsers = this.enagagedUsers + user["id"] + " ";
                  }
                }
              }
            });
          });
          if(this.assessmentSchduledData.length  === i) {
          if (this.confirmed) {
            this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
            alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.\n Please find the Assessment Key :  "+this.key);
          } else {
            alert("Already " + this.enagagedUsers + " has been engagged " + Stype + " between " + subTime + " - " + addTime + "\nSo, you can't schedule exam for above mentioned users.");
            this.enagagedUsers = "";
          }
        }
      }
      });
      if( !this.isAvailable) {
      this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
      alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.\n Please find the Assessment Key :  "+this.key);
      }
    } else {
      this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
      alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.\n Please find the Assessment Key :  "+this.key);
    }
  }

  onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration) {
    this.db.list('/AssessmentSchedulerTracker').push({
      scheduler_info: {
        id: sessionStorage.getItem('DomainAdmin'),
        time: Ctime
      },
      scheduled_info: {
        name: Stype,
        date: Sdate,
        time: Stime,
        duration: Sduration,
        users: this.users
      }
    });
    this.db.list("/AssessmentUserStatusTracker").push({
      assessment_id: Sdate + "_" + Stime + "_" + Sduration + "_" + Stype,
      status: 'Unstarted',
      scheduled_info: {
        name: Stype,
        date: Sdate,
        time: Stime,
        duration: Sduration,
        users: this.users
      }
    }).then(data => this.key = data.key);
  }

  onAppend(input) {
    let index = this.users.findIndex(fUser => fUser['id'] as string === input);
    if (index < 0) {
      this.users.push({ id: input, status: 'Unstarted' });
      console.log(this.users);
    } else {
      this.users.splice(index, 1);
      console.log(this.users);
    }
  }

  signOut() {
    this.service.logOut();
  }
}
