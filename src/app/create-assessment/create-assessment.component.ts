import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
media: Subscription;
  top;
  size: number;
  bottom: string;
  userList = [];
  options = [];
  loggedUser;
  subscribe: Subscription;
  options1= [];

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) { 
    if(localStorage.getItem('DomainAdmin')) {
      this.loggedUser = localStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = localStorage.getItem('DomainUser')
    }
    this.subscribe = this.db.list('/UserList').snapshotChanges().subscribe( options => {
      options.map( user => {
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

Submit = new FormGroup({
  assessment: new FormControl("", Validators.required),
  question : new FormControl("", Validators.required),
  ans: new FormControl("", Validators.required),
  option : new FormControl()
});

onSubmit() {
  let Ctime = moment().format("MM/DD/YYYY HH:mm:ss");
  let Stype = this.Submit.get('assessment').value;
  this.db.list('/AssessmentSubmissionTracker').push({
    add_info : {
      id: localStorage.getItem('DomainAdmin'),
      time: Ctime,
      name: Stype
    }
  });
  this.options.push({name: Stype});
  this.db.list("/AssessmentsData").push({qa_info: this.options});
  alert(Stype+" has been uploaded sucessfully.");
}


onAppend(input) {
let index = this.options1.findIndex(option => option['opt']  === input);
if(index < 0) {
  this.options1.push({ opt: input});
  console.log(this.options1);
}  else {
  alert("Duplicate Entry");
}
this.Submit.get('option').reset();
}

onSave() {
let ques =  this.Submit.get('question');
let opt = this.Submit.get('option').value;
let Ans = this.Submit.get('ans');
console.log("ANS1", this.Submit.get('ans'));
console.log("ANS :", Ans.value);
this.options1.push({qa: ques.value});
this.options1.push({ans: Ans.value});
this.options.push(this.options1);
this.options1 = [];
ques.reset();
Ans.reset();
console.log("save : ", this.options);
}
onDelete(input) {
  let index = this.options1.findIndex(option => option['opt'] as string === input);
  if(index > -1) {
    this.options1.splice(index, 1);
  } 
  }

signOut() {
  this.service.logOut();
}
ngOnDestroy() {
  this.subscribe.unsubscribe();
}
}
