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
  subscribe: Subscription;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) { 
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
  let Ctime = moment().format("MM-DD-YYYY HH:mm:ss");
  let Sdate = moment(this.schedule.get('date').value).format('DD-MM-YYYY');
  let Stype = this.schedule.get('assessment').value;
  let Stime = this.schedule.get('time').value;
  let Sduration = this.schedule.get('duration').value * 60;
  let Susers: any[] = this.schedule.get('users').value;
  console.log("SUSER : "+Susers);
  this.db.list('/AssessmentScheduler').push({
    status: 'Scheduled',
    name: Stype,
    date: Sdate,
    time: Stime,
    duration: Sduration,
    users : Susers
  });
  this.db.list("/AssessmentSchedulerTracker").push({
    id: localStorage.getItem('DomainAdmin'),
    time: Ctime
  });
  alert(Stype+" has been scheduled on "+Sdate+" "+Stime+" sucessfully.");
}

onAppend(user) {
  let users = this.schedule.get('users');
  let array: any[] = [this.schedule.get('users')];
  if(!(users.value as string).includes(user)) {
  (users as FormArray).push(new FormControl(user));
  console.log((users.value));
  } else {
    (users as FormArray).removeAt(array.findIndex( data => data === user));
    console.log((users.value));
  }
}
signOut() {
  this.service.logOut();
}
ngOnDestroy() {
  this.subscribe.unsubscribe();
}
}
