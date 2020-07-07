import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-schedule-exam',
  templateUrl: './schedule-exam.component.html',
  styleUrls: ['./schedule-exam.component.css']
})
export class ScheduleExamComponent implements OnInit {
  device: number;
  media: Subscription;
  top;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      console.log(change.mqAlias);
      if(change.mqAlias === 'xs') {
        this.device = 90;
        this.top = '450px';
      } 
      else if(change.mqAlias === 'sm') {
        this.device = 60;
        this.top = '450px';
      }
      else if (change.mqAlias === 'md') {
        this.device = 35;
        this.top = '120px';
      }
      else {
        this.device = 35;
        this.top = '120px';
      }
  });
}

schedule = new FormGroup({
  assessment: new FormControl("", Validators.required),
  date: new FormControl("", Validators.required),
  time: new FormControl("", Validators.required)
});

onSchedule() {
  let Ctime = moment().format("DD-MM-YYYY HH:mm:ss");
  let Sdate = moment(this.schedule.get('date').value).format('DD-MM-YYYY');
  let Stype = this.schedule.get('assessment').value;
  let Stime = this.schedule.get('time').value;
  this.db.object('/AssessmentScheduler').set({
    name: Stype,
    date: Sdate,
    time: Stime
  });
  this.db.list("/AssessmentSchedulerTracker").push({
    id: localStorage.getItem('DomainAdmin'),
    time: Ctime
  });
  alert(Stype+" has been scheduled on "+Sdate+" "+Stime+" sucessfully.");
}


signOut() {
  this.service.logOut();
}
}
