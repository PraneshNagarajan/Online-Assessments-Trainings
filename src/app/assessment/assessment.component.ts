import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import * as moment from 'moment';

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
  timer;
  timer1;
  top;
  bottom;
  col;
  k = 0;
  Loop = 0;
  childID = -1;
  tableID;
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
    let i = 0;
    if (localStorage.getItem('DomainAdmin')) {
      this.loggedUser = localStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = localStorage.getItem('DomainUser')
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.k <= 0 && this.assessmentDatas.length > 0) {
          alert("If you leave this page again. Assessment will exit automatically.");
          ++this.k;
        } else if (this.k > 0 && this.assessmentDatas.length > 0) {
          this.onSubmit();
        }
      }
    }, false);
    this.DB = this.db.list('/AssessmentUserStatusTracker').snapshotChanges().subscribe((data) => {
      data.map(assessment => {
        this.assessmentlist.push({ key: assessment.key, assessment: assessment.payload.val() });
      });
      this.assessmentlist.map(list => {
        this.ngOnDestroy();
        ++i;
        let users: any[] = list['assessment']['scheduled_info']['users'];
        if (list['assessment']['status'] === "Unstarted") {
          let j = 0
          this.isAvailable = true;
          users.map(user => {
            if (!this.isScheduled) {
              ++j;
              this.Sname = list['assessment']['scheduled_info']['name'];
              this.Sdate = list['assessment']['scheduled_info']['date'];
              let Cdate = moment(this.time).format("MM/DD/YYYY");
              this.Stime = list['assessment']['scheduled_info']['time'];
              if (Cdate === this.Sdate) {
                if (user['id'] === this.loggedUser) {
                  this.isAvailable = true;
                  if (user['status'] === "Unstarted") {
                    this.tableID = list.key;
                    this.childID = j - 1;;
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
                          this.duration = list['assessment']['scheduled_info']['duration'] - seconds;
                          this.timer = this.duration;
                          this.isLate = true;
                          this.assessmentDatas = this.service.getAssessment(list['assessment']['scheduled_info']['name']);
                          clearInterval(interval);
                          if (confirm("Please Click 'OK' button to start Assessment.")) {
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
                          this.assessmentDatas = this.service.getAssessment(list['assessment']['scheduled_info']['name']);
                          this.timer1 = list['assessment']['scheduled_info']['duration'];
                          this.isAvailable = false;
                          clearInterval(interval);
                          if (confirm("Please Click 'OK' button to start Assessment.")) {
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
                      this.msg = "No Assessment scheduled for you at this moment."
                    }
                  }
                } else {
                  if (users.length === j && !this.isAvailable) {
                    this.isAvailable = true;
                    this.msg = "No Assessment scheduled for you at this moment."
                  }
                }
              } else {
                if (this.assessmentlist.length === i) {
                  this.isAvailable = true;
                  this.msg = "No Assessment scheduled for you at this moment."
                }
              }
            }
          });

        } else {
          if (this.assessmentlist.length === i && !this.isAvailable) {
            this.isAvailable = true;
            this.msg = "No Assessment scheduled for you at this moment."
          }
        }
      });
    });
    this.userName = localStorage.getItem('username');
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

  handleVisibilityChange(k) {
    if (document.hidden) {
      ++k;
      alert(k);
    }
  }

  ondispaly() {
    alert("If you leave this page again. Assessment will exit automatically");
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

  onUpdateStatus() {
    let refDB = this.db.database.ref('/AssessmentUserStatusTracker/' + this.tableID);
    refDB.child('scheduled_info').child('users').child(String(this.childID)).update({
      status: (!this.isConfirmed) ? "Started" : "Finished"
    });
    this.isConfirmed = !this.isConfirmed;
  }

  onSubmit() {
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
    localStorage.removeItem('DomainUser');
    this.router.navigate(['/homePage']);
    this.db.list('/AssessmentResultsTracker').push({
      id: this.loggedUser,
      assessent_id: this.Sdate + "_" + this.Stime + "_" + this.Sname,
      result: {
        date: moment().format("MM/DD/YYYY"),
        mark: i + '/' + this.dbsize
      }
    });
    this.onUpdateStatus();
    let statusUser = [];
    let statusFlag = true;
    this.db.list('/AssessmentUserStatusTracker').snapshotChanges().subscribe(datas => {
      datas.map(data => {
        statusUser = data['assessment']['scheduled_info']['users'];
        statusUser.map(user => {
          if (user.status === "started") {
            statusFlag = false;
          }
        });
        if (statusFlag) {
          this.db.database.ref('/AssessmentUserStatusTracker/' + this.tableID).update({
            status: "Completed"
          });
        }
      });
    });
  }

  handleEvent(value: Event) {
    if (value['action'] === 'done') {
      this.db.database.ref('/AssessmentUserStatusTracker/' + this.tableID).update({
        status: "Completed"
      });
      this.countdown = true;
      this.onSubmit();
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
      this.onSubmit();
    }
  }

  signOut() {
    this.service.logOut();
  }

  ngOnDestroy() {
    this.DB.unsubscribe();
  }
}
