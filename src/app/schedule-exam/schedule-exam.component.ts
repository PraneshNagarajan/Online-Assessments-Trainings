import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription, Observable } from 'rxjs';
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
  assessmentList = [];
  users = []
  loggedUser;
  assessmentSchduledData = [];
  users1 = [];

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) {

    console.log("convert", moment.duration("1500", "seconds").format());
    if (localStorage.getItem('DomainAdmin')) {
      this.loggedUser = localStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = localStorage.getItem('DomainUser')
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
    })
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
    users: new FormArray([])
  });

  onSchedule() {
    let Ctime = moment().format("MM/DD/YYYY HH:mm:ss");
    let Sdate = moment(this.schedule.get('date').value).format('MM/DD/YYYY');
    let Stype = this.schedule.get('assessment').value;
    let Stime = this.schedule.get('time').value;
    let Sduration = this.schedule.get('duration').value * 60;
    this.assessmentSchduledData.map(data => {
      let Users: any[] = data['scheduleded_info']['users'];
      let date = (data.assessment_id as string).split('_')[0];
      let time = (data.assessment_id as string).split('_')[1];
      let duration = Number((data.assessment_id as string).split('_')[2]);
      if (data.status === "Unstarted") {
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
          console.log("USERSD :", user['id']);
          this.users.map(user1 => {
            console.log(user1['id']);
            if (user['id'] === user1['id']) {
              if ((date === Sdate)) {
                if (!moment(Stime, "HH:mm:ss").isBetween(moment(subTime, "HH:mm:ss"), moment(addTime, "HH:mm:ss"))) {
                  this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
                  alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.");
                } else {
                  alert("Already " + user['id'] + " has been engagged " + Stype + " between" + subTime + " - " + addTime);
                }
              } else {
                this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
                alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.");
              }
            } else {
              this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration);
              alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.");
            }
          });
        });
      }
    });
  }

  onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration) {
    this.db.list('/AssessmentSchedulerTracker').push({
      scheduler_info: {
        id: localStorage.getItem('DomainAdmin'),
        time: Ctime
      },
      scheduled_info: {
        name: Stype,
        date: Sdate,
        time: Stime,
        duration: Sduration,
        users: this.users1
      }
    });
    this.db.list("/AssessmentUserStatusTracker").push({
      assessment_Id: Sdate + "_" + Stime + "_" + Sduration + "_" + Stype,
      status: 'Unstarted',
      scheduleded_info: {
        name: Stype,
        date: Sdate,
        time: Stime,
        duration: Sduration,
        users: this.users
      }
    });
  }

  onAppend(input) {
    let index = this.users.findIndex(fUser => fUser['id'] as string === input);
    if (index < 0) {
      this.users.push({ id: input, status: 'Unstarted' });
      this.users1.push({ id: input });
    } else {
      this.users.splice(index, 1);
    }
  }

  signOut() {
    this.service.logOut();
  }
}
