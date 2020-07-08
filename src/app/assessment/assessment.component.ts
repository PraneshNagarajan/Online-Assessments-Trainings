import { Component, OnInit } from '@angular/core';
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
export class AssessmentComponent implements OnInit {
  Arole;
  crt;
  wrng;
  userName;
  duration;
  assessmentlist = [];
  userAnswered = [];
  dbsize;
  msg;
  timer;
  countdown: boolean;
  isSpinner: boolean;
  isLate:boolean;
  isAvailable: boolean;
  assessmentDatas = [];
  quesDatas = [];
  device;
  top;
  time = new Date();
  media: Subscription;
  roles = [
    { name: 'admin' },
    { name: 'user' }
  ];
  timer1: any;

  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService) {
    this.db.list('/AssessmentScheduler').snapshotChanges().subscribe((data) => {
      data.map( assessment => {
      this.assessmentlist.push( {value: assessment.payload.val()});
      this.assessmentlist.map(list => {
      if(list['value']['status'] === "Scheduled") {
        let Cdate = moment(this.time).format("MM/DD/YYYY");
        let Ctime = moment(this.time).format("MM/DD/YYYY HH:mm:ss");
        let Stime1:string = list['value']['time'];
        let Sdate = (list['value']['date'] as string);
        if( Cdate === Sdate) {
          setInterval(() => {
            this.time = new Date();
            Ctime = moment(this.time).format("MM/DD/YYYY HH:mm:ss");
            let Stime = Sdate+" "+Stime1;
            let Shour = Number(Stime1.split(':')[0]);
            let Smin =  Number(Stime1.split(':')[1]);
            let Chour = Number(moment(this.time).format('HH'));
            let Cmin = Number(moment(this.time).format('mm'));
            if((Chour > Shour) || ( (Chour === Shour) && (Cmin > Smin ))) {
              let SchTime = moment.utc(moment(Ctime, "MM/DD/YYYY HH:mm:ss").diff(moment(Stime, "MM/DD/YYYY HH:mm:ss"))).format("HH:mm:ss");
              if(Number(SchTime.split(':')[1]) <= 10) {
                let i = 0;
                let seconds = Number(SchTime.split(':')[1])*60+Number(SchTime.split(':')[2]);
                if(i == 0){
                  this.duration = list['value']['duration'] - seconds;
                  this.timer = this.duration;
                }
                this.isLate = true;
                this.assessmentDatas = this.service.getAssessment(list['value']['name']);
              } else {
                this.msg = "Assessment already started. You arn't allowed..."
                this.isAvailable = true;
              }
            } else  {
              let SchTime = moment.utc(moment(Stime, "MM/DD/YYYY HH:mm:ss").diff(moment(Ctime, "MM/DD/YYYY HH:mm:ss"))).format("HH:mm:ss");
            if(Number(SchTime === "00:00:00")) {
              this.assessmentDatas = this.service.getAssessment(list['value']['name']);
              this.timer1 = list['value']['duration'];
            } else {
              this.msg = "Assessment will start on " + SchTime;
              this.isAvailable = true;
            }
          }
        }, 1000);
        }
      }
      else {
        this.msg = "No Assessment scheduled today.";
        this.isAvailable = true;
      }
    });
  });
});
  this.userName = localStorage.getItem('username');
  }
    

  ngOnInit() {
    
  }

  

onSubmit() {
let i = 0;
  this.quesDatas.map( value => {
    this.userAnswered.map( userAns =>  {
      if(value.assesment1.ans === userAns.ans)  {
          i = ++i;
      }
  });
});
this.dbsize = this.quesDatas.length;
this.crt = i;
this.wrng = this.dbsize - i;
if(this.countdown) {
  alert("OOPS ! Time is Over\nCorrect answers: " + i + '\n' + 'Incorrect answers :'+ this.wrng );
} else {
  alert("Correct answers: " + i + '\n' + 'Incorrect answers :'+ this.wrng );
}
localStorage.removeItem('DomainUser');
this.router.navigate(['']);
this.db.list('/OnlineExam').push( {
  id: this.userName,
  result: {
  date: moment().format("DD-MM-YYYY"),
  mark: this.crt+'/'+ this.dbsize
  }
});

this.db.object('/AssessmentScheduler').set({
  status: 'Unscheduled'
});
  }

handleEvent(value: Event) {
  if( value['action'] === 'done') {
    this.countdown =  true;
    this.onSubmit();
  }
}

save(Uqa, Uans) {
  let index = this.userAnswered.findIndex( x => x.qa === Uqa);
  if(index > -1) {
    this.userAnswered[index]['ans'] = Uans;
  } else {
    this.userAnswered.push({qa: Uqa, ans: Uans});
  }
}

confirm() {
  this.dbsize = this.quesDatas.length; 
  let unAns= this.dbsize - this.userAnswered.length;
  if(confirm('Are you sure to submit?\nAnswered Questions: '+this.userAnswered.length+'\n'+'Unanswered Questions: '+ unAns)){
    this.onSubmit();
  } 
}
  signOut() {
    this.service.logOut();
    }
}
