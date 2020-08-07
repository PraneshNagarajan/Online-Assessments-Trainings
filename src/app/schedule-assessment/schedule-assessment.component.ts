import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';
import 'moment-duration-format';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth.service'
import * as firebase from 'firebase'
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-schedule-assessment',
  templateUrl: './schedule-assessment.component.html',
  styleUrls: ['./schedule-assessment.component.css']
})
export class ScheduleAssessmentComponent implements OnInit {
  media: Subscription;
  top;
  size: number;
  bottom: string;
  userList = [];
  isAvailable: boolean;
  assessmentList = [];
  enagagedUsers = "";
  users = []
  loggedUser;
  assessmentSchduledData = [];
  users1 = [];
  confirmed: boolean = true;
  key: any = "";
  catagoryList = [];
  subIndex;
  minDate: Date;

  constructor(private auth: AuthService, private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase, private router: Router) {
    router.events.subscribe( (event : NavigationStart) => {
      if(event.navigationTrigger === 'popstate') {
        router.navigateByUrl('/adminPage')
      }
      });
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.minDate = new Date(moment().year(), moment().month(), moment().date());
    this.db.list('/ManageUsers').snapshotChanges().subscribe(datas => {
      let users =[]; 
      this.userList = [];
      datas.map(data => {
        users.push(data.payload.val());
      });
      users.map( user => {
        if(user['status'] !== 'Removed') {
          this.userList.push(user['userid']);
        }
      });
    });
    this.db.list("/Catagories").snapshotChanges().subscribe( datas => {
      this.catagoryList = [];
      datas.map( data => {
        this.catagoryList.push(data.payload.val());
      });
    });
    this.db.list("/AssessmentUserStatusTracker").snapshotChanges().subscribe(data => {
      data.map(assessmentData => {
        this.assessmentSchduledData.push(assessmentData.payload.val());
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = 90;
        this.top = "5%";
        this.bottom = "100%";
      }
      else if (change.mqAlias === 'sm') {
        this.size = 90;
        this.top = "5%"
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
    catagory: new FormControl("", Validators.required),
    subcatagory:new FormControl("", Validators.required),
    assessment: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    time: new FormControl("", Validators.required),
    duration: new FormControl("", Validators.required),
    users: new FormControl("", Validators.required)
  });
  get catagory() {
    return this.schedule.get("catagory");
  }
  get subcatagory() {
    return this.schedule.get("subcatagory");
  }
  getSubCatagory(index) {
    this.subIndex = index;
  }
  getAssessmentName() {
    this.db.list("/AssessmentsData/" +this.catagory.value + '/' + this.subcatagory.value).snapshotChanges().subscribe(datas => {
     this.assessmentList = [];
      datas.map(data => {
        this.assessmentList.push(data.key);
      });
      if( this.assessmentList.length === 0) {
        alert("No Assessment Found under " + this.subcatagory.value+"\nPlease add assessment under "+ this.subcatagory.value+" and then try.");
      }
    });
  }
  onSchedule() {
    let i = 0;
    let addTime, subTime;
    let Ctime = moment().format("MM/DD/YYYY HH:mm:ss");
    let Sdate = moment(this.schedule.get('date').value).format('MM/DD/YYYY');
    let Stype = this.schedule.get('assessment').value;
    let Stime = this.schedule.get('time').value;
    let Sduration = this.schedule.get('duration').value * 60;
    if (this.assessmentSchduledData.length > 0) {
      this.assessmentSchduledData.map(data => {
        ++i;
        let Users: any[] = data['scheduled_info']['users'];
        let date = data['scheduled_info']['date'];
        let time = data['scheduled_info']['time'];
        let duration = data['scheduled_info']['duration'];
        if (data.status === "Unstarted") {
          this.isAvailable = true;
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
                    this.enagagedUsers = this.enagagedUsers +"Already " + user['id'] + " has been engagged " + Stype + " between " + moment(time, "HH:mm:ss").subtract("00:" + moment.duration('300', "seconds").format("HH:mm:ss")).format("HH:mm:ss") + " - " + addTime + ".\n";
                  }
                }
              }
            });
          });
        }
      });
      if (this.confirmed || !this.isAvailable) {
        this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration, this.catagory.value, this.subcatagory.value);
      } else {
        alert(this.enagagedUsers);
        this.enagagedUsers = "";
        this.users = [];
        this.users1 = [];
      }
    } else {
      this.onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration, this.catagory.value, this.subcatagory.value);
    }
    this.schedule.reset();
    this.assessmentSchduledData = [];
  }

  onUpdateDB(Ctime, Stype, Sdate, Stime, Sduration, Scatagory, Ssubcatagory) {
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
        name: Scatagory+ '/' + Ssubcatagory+'/'+Stype,
        date: Sdate,
        time: Stime,
        duration: Sduration,
        users: this.users
      }
    }).then(data => {
      alert(Stype + " has been scheduled on " + Sdate + " " + Stime + " sucessfully.\n Please find the Assessment Key :  " + data.key);
      this.db.list("/notifications").push({
        title: "Notification for Assessment Scheduled",
        catagory: Scatagory,
        subcatagory: Ssubcatagory,
        topic: (Stype as string).split(':-')[1],
        name: (Stype as string).split(':-')[0],
        date: Sdate,
        time: Stime,
        duration: (Sduration < 3600) ? '00:' + moment.duration(Sduration, 'seconds').format("HH:mm:ss") + " Minutes" : moment.duration(Sduration, 'seconds').format("HH:mm:ss") + " Hours",
        users: this.users1,
        key: data.key
      });
      this.users = [];
      this.users1 = [];
    });

  }

  onAppend(input) {
    let index = this.users.findIndex(fUser => fUser === input);
    if (index < 0) {
      this.users.push({ id: input, status: 'Unstarted' });
      this.users1.push({ id: input, status: 'Unread' });
    } else {
      this.users.splice(index, 1);
      this.users1.splice(index, 1);
    }
  }

  signOut() {
    this.auth.logOut();
  }
}

