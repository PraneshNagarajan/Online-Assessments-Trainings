import { Component, OnInit, OnDestroy, ElementRef, Directive } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpecialCharacterValidators } from '../Validators/specialCharacter.validators';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})

export class AssessmentComponent implements OnInit, OnDestroy {
  SelOption;
  userName;
  duration;
  dbsize;
  msg = "";
  assessmentKey: boolean;
  timer;
  timer1;
  top;
  bottom;
  col;
  k = 0;
  Loop = 0;
  childID = -1;
  loggedUser;
  Sname: string;
  Sdate: string;
  Stime: string;
  time = new Date();
  DB: Subscription;
  media: Subscription;
  isAvailable: boolean;
  isConfirmed: boolean;
  isScheduled: boolean;
  countdown: boolean;
  isLate: boolean;
  next: boolean;
  back: boolean;
  assessmentlist = [];
  assessmentDatas = [];
  userAnswered = [];


  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    document.addEventListener("keydown", key => {
      if ((key.altKey || key.key === "Tab") && this.assessmentDatas.length > 0) {
        if (this.k === 0) {
          ++this.k;
        } else if (this.k > 0 && this.assessmentDatas.length > 0) {
          this.onSubmit("leave the tab");
        }
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.assessmentDatas.length > 0) {
          this.onSubmit("leave the tab");
      }
    }, false);
    this.userName = sessionStorage.getItem('username');
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.col = 1
        this.top = "50%"
        this.bottom = "100%"
      }
      else if (change.mqAlias === 'sm') {
        this.col = 1;
        this.top = "50%"
        this.bottom = "100%"
      }
      else if (change.mqAlias === 'md') {
        this.col = 2;
        this.top = "5%"
        this.bottom = "100%"
      }
      else {
        this.col = 2;
        this.top = "5%"
        this.bottom = "100%"
      }
    });
  }

  form = new FormGroup({
    key: new FormControl("", [
      Validators.required,
      SpecialCharacterValidators.foundAsessmentKeyCharacter,
      SpecialCharacterValidators.notFoundSpecialCharacter,
      Validators.minLength(15)
    ])
  });

  handleVisibilityChange(k) {
    if (document.hidden) {
      ++k;
      alert(k);
    }
  }
get key() {
return this.form.get('key');
}
  lanuchAssessment() {
    window.location.reload;
    let j = 0;
    this.assessmentKey = true;
   this.DB = this.db.list('/AssessmentUserStatusTracker/' + this.key.value).valueChanges().subscribe(data => {
      if(data.length > 0) {
      this.assessmentlist = data;
      let Cdate = moment(this.time).format("MM/DD/YYYY");
      this.Stime = this.assessmentlist[1]['time'];
      this.Sname = this.assessmentlist[1]['name'];
      this.Sdate = this.assessmentlist[1]['date'];
      if (this.assessmentlist[2] !== "Completed") {
        this.isAvailable = true;
        let users: any[] = this.assessmentlist[1]['users'];
        users.map(user => {
          if (!this.isScheduled) {
            ++j;
            if (Cdate === this.Sdate) {
              if (user['id'] === this.loggedUser) {
                this.isAvailable = true;
                if (user['status'] === "Unstarted") {
                  this.childID = j - 1;
                  setInterval(() => this.time = new Date());
                  let interval = setInterval(() => {
                    let Stime1 = this.Sdate + " " + this.Stime;
                    let Shour = Number(moment(this.Stime, "HH:mm:ss").format("HH"));;
                    let Smin = Number(moment(this.Stime, "HH:mm:ss").format("mm"));
                    let Chour = Number(moment(this.time).format('HH'));
                    let Cmin = Number(moment(this.time).format('mm'));
                    if ((Chour > Shour) || ((Chour === Shour) && (Cmin >= Smin))) {
                      let SchTime = moment.utc(moment(this.time, "MM/DD/YYYY HH:mm:ss").diff(moment(Stime1, "MM/DD/YYYY HH:mm:ss"))).format("HH:mm:ss");
                      if (Number(SchTime.split(':')[1]) <= 10) {
                        this.isAvailable = false;
                        let seconds = Number(SchTime.split(':')[1]) * 60 + Number(SchTime.split(':')[2]);
                        this.duration = this.assessmentlist[1]['duration'] - seconds;
                        this.timer = this.duration;
                        this.isLate = true;
                        this.assessmentDatas = this.service.getAssessment(this.Sname);
                        clearInterval(interval);
                        if (confirm("Please Click 'OK' button to start Assessment.")) {
                          this.ngOnDestroy();
                          this.onUpdateStatus();
                        }
                      } else {
                        this.msg = "Assessment already started...."
                        this.isAvailable = true;
                        clearInterval(interval);
                      }
                    }
                    else {
                      let SchTime = moment.utc(moment(Stime1, "MM/DD/YYYY HH:mm:ss").diff(moment(this.time, "MM/DD/YYYY HH:mm:ss"))).format("HH:mm:ss");
                      if (Number(SchTime === "00:00:00")) {
                        this.assessmentDatas = this.service.getAssessment(this.Sname);
                        this.timer1 = this.assessmentlist[1]['duration'];
                        this.isAvailable = false;
                        clearInterval(interval);
                        if (confirm("Please Click 'OK' button to start Assessment.")) {
                          this.ngOnDestroy();
                          this.onUpdateStatus();
                        }
                      }
                      else {
                        this.msg = "Assessment will start on " + SchTime;
                        this.isAvailable = true;
                      }
                    }
                  }, 1000);
                } else {
                  if (user['status'] === "Started") {
                    alert("Already you have started Assessement.");
                    this.router.navigate(['/homePage']);
                  } else {
                    this.isAvailable = true;
                    this.msg = "Assessment Completed."
                  }
                }
              } else {
                if (users.length === j && !this.isAvailable) {
                  this.isAvailable = true;
                  this.msg = "You don't have permission to take this assessment."
                }
              }
            } else {
              this.isAvailable = true;
              this.msg = "No Assessment scheduled for you at this moment."
            }
          }
        });
      } else {
        this.isAvailable = true;
        this.msg = "This assessment has done."
      }
    } else {
      this.isAvailable = true;
        this.msg = "Invalid key. Please enter valid key."
    }
    });
  }
  onNext() {
    ++this.Loop;
    this.userAnswered.map(data => {
      if (data.index === this.Loop) {
        this.SelOption = data.ans;
      }
    });
    this.next = false;
    this.back = true;
  }

  onBack() {
    --this.Loop;
    this.userAnswered.map(data => {
      if (data.index === this.Loop) {
        this.SelOption = data.ans;
      }
    });
    if (this.Loop > 0) {
      this.back = true;
    } else {
      this.back = false;
    }
    this.next = true;
  }

  onUpdateStatus(remark?) {
    let refDB = this.db.database.ref('/AssessmentUserStatusTracker/' + this.key.value);
    refDB.child('scheduled_info').child('users').child(String(this.childID)).update({
      status: (!this.isConfirmed && !remark) ? "Started" : "Completed",
      remarks: (remark) ? remark: ""
    });
    if(!this.isConfirmed){
      this.db.object('/AssessmentUserStatusTracker/' + this.key.value).update({
        status: "Started"
      });
    }
    this.isConfirmed = !this.isConfirmed;
  }

  onSubmit(remark) {
    let i = 0;
    this.assessmentDatas.map(value => {
      this.userAnswered.map(userAns => {
        if (value.assessment.ans === userAns.ans) {
          i = ++i;
        }
      });
    });
    if (this.countdown) {
      alert("OOPS ! Time is Over\nCorrect answers: " + i + '\n' + 'Incorrect answers :' + (this.dbsize - i));
    } else {
      alert("Correct answers: " + i + '\n' + 'Incorrect answers :' + (this.dbsize - i));
    }
    sessionStorage.removeItem('DomainUser');
    this.router.navigate(['/homePage'], { skipLocationChange: false });
    this.db.list('/AssessmentResultsTracker').push({
      id: this.loggedUser,
      assessent_id: this.Sdate + "_" + this.Stime + "_" + this.Sname,
      result: {
        date: moment().format("MM/DD/YYYY"),
        mark: i + '/' + this.dbsize
      }
    });
    this.ngOnDestroy();
    this.onUpdateStatus(remark);
    let statusFlag = true;
    this.db.list('/AssessmentUserStatusTracker/' + this.key.value).valueChanges().subscribe(data => {
      this.assessmentlist = data;
      let users: any[] = data[1]['users'];
      users.map(user => {
        if (user.status === "Started") {
          statusFlag = false;
        }
      });
      if (statusFlag) {
        this.db.object('/AssessmentUserStatusTracker/' + this.key.value).update({
          status: "Completed"
        });
      }
    });
  }

  handleEvent(value: Event) {
    if (value['action'] === 'done') {
      this.db.object('/AssessmentUserStatusTracker/' + this.key.value).update({
        status: "Completed"
      });
      this.countdown = true;
      this.onSubmit("Time up");
    }
  }

  onSave(Uqa: any[], Uans) {
    this.dbsize = this.assessmentDatas.length;
    this.SelOption = Uans;
    let QA = Uqa['assessment']['qa']
    let index = this.userAnswered.findIndex(x => x.qa === QA);
    if (index > -1) {
      this.userAnswered[index]['ans'] = Uans;
    } else {
      this.userAnswered.push({ index: this.Loop, qa: QA, ans: Uans });
    }
    if (this.Loop < this.dbsize - 1) {
      this.next = true;
    }
  }

  onConfirm() {
    this.dbsize = this.assessmentDatas.length;
    let unAns = this.dbsize - this.userAnswered.length;
    if (confirm('Are you sure to submit?\nAnswered Questions: ' + this.userAnswered.length + '\n' + 'Unanswered Questions: ' + unAns)) {
      this.onSubmit("user done the assessment");
    }
  }

  signOut() {
    this.service.logOut();
  }

  ngOnDestroy() {
    if (!this.isConfirmed) {
      this.DB.unsubscribe();
    } else {
      this.assessmentDatas = [];
    }
  }
}
