import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription, Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-schedule-exam',
  templateUrl: './schedule-exam.component.html',
  styleUrls: ['./schedule-exam.component.css']
})
export class ScheduleExamComponent implements OnInit, OnDestroy {
  media: Subscription;
  top;
  size: number;
  bottom: string;
  userList = [];
  users = []
  loggedUser;
  subscribe: Subscription;
  users1= [];

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) { 
    if(localStorage.getItem('DomainAdmin')) {
      this.loggedUser = localStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = localStorage.getItem('DomainUser')
    }
    this.subscribe = this.db.list('/UserList').snapshotChanges().subscribe( users => {
      users.map( user => {
        this.userList.push(user.payload.val());
      })
      this.ngOnDestroy();
    });
  

  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.size = 90;
        this.top="50%"
        this.bottom="100%"
      } 
      else if(change.mqAlias === 'sm') {
        this.size = 90;
        this.top="50%"
        this.bottom="100%"
      }
      else if (change.mqAlias === 'md') {
        this.size = 80;
        this.top="10%"
        this.bottom="100%"
      }
      else {
        this.size = 80;
        this.top="10%"
        this.bottom="100%"
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
  this.db.list('/AssessmentSchedulerTracker').push({
    scheduler_info : {
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
    asssessment_Id : Sdate+"_"+Stime+"_"+Stype,
    scheduled_info: {
    name: Stype,
    date: Sdate,
    time: Stime,
    duration: Sduration,
    users: this.users
    }
  });
  alert(Stype+" has been scheduled on "+Sdate+" "+Stime+" sucessfully.");
}


onAppend(input) {
let index = this.users.findIndex(fUser => fUser['id'] as string === input);
if(index < 0) {
  this.users.push({ id: input, status: 'Unstarted'});
  this.users1.push({ id: input});
} else {
  this.users.splice(index, 1);
}
}

signOut() {
  this.service.logOut();
}
ngOnDestroy() {
  this.subscribe.unsubscribe();
}
}
