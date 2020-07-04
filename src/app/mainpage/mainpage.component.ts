import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from '../data.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  Arole;
  crt;
  wrng;
  userName;
  userAnswered = [];
  dbsize;
  countdown: boolean;
  isSpinner: boolean;
  userDatas = [];
  quesDatas = [];
  deviceXs;
  deviceStyle;
  mediaSubscribe: Subscription;
  roles = [
    { name: 'admin' },
    { name: 'user' }
  ];

  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService) {
    this.userDatas = service.getData();
    this.quesDatas = service.getAssesment1();
    
    let admin = localStorage.getItem('DomainAdmin');
    let user =  localStorage.getItem('DomainUser');
    if (admin) {
      this.Arole = 'DomainAdmin';
      this.userName = admin;
    } else {
      this.userName = user;
    }
  }

  ngOnInit() {
    this.mediaSubscribe = this.mediaObserver.media$.subscribe((device: MediaChange) => {
      this.deviceXs = device.mqAlias === 'xs' ? '90%' : '35%';
      this.deviceStyle = (device.mqAlias === 'xs') ? 'column' : 'row';
    });
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
this.crt = i;
this.wrng = this.dbsize - i;
if(this.countdown) {
  alert("OOPS ! Time is Over\nCorrect answers: " + i + '\n' + 'Incorrect answers :'+ this.wrng );
} else {
  alert("Correct answers: " + i + '\n' + 'Incorrect answers :'+ this.wrng );
}
localStorage.removeItem('DomainUser');
this.router.navigate(['']);
this.db.list('/OnlineExam').push({
  id : this.userName,
  date: moment().format("DD-MM-YYYY"),
  mark: this.crt+'/'+ this.dbsize
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
  console.log(index);
  if(index > -1) {
    this.userAnswered[index]['ans'] = Uans;
  } else {
    this.userAnswered.push({qa: Uqa, ans: Uans});
  }
  this.dbsize = this.quesDatas.length;
}

confirm() {
  let unAns= this.dbsize - this.userAnswered.length;
  if(confirm('Are you sure to submit?\nAnswered Questions: '+this.userAnswered.length+'\n'+'Unanswered Questions: '+ unAns)){
    this.onSubmit();
  } 
}
  signOut() {
    this.afAuth.auth.signOut();
    if (localStorage.getItem('DomainUser')) {
      localStorage.removeItem('DomainUser');
    } else {
      localStorage.removeItem('DomainAdmin');
    }
    this.router.navigate(['']);
  }
}
