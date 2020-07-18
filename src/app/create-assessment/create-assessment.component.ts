import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CreateAssessmentComponent implements OnInit, OnDestroy {
media: Subscription;
  top;
  size: number;
  bottom: string;
  listSize;
  options = [];
  loggedUser;
  subscribe: Subscription;
  options1= [];
  assessmentName: any;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private db: AngularFireDatabase) { 
    let i = 1;
    if(localStorage.getItem('DomainAdmin')) {
      this.loggedUser = localStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = localStorage.getItem('DomainUser')
    }
   this.subscribe = this.db.list('/AssessmentList').snapshotChanges().subscribe( options => {
      options.map( user => { 
       ++i;
      });
      this.Submit.get('assessment').setValue("Assessment"+i);
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
  assessment: new FormControl({ value: "", disabled:true}),
  question : new FormControl("", Validators.required),
  ans: new FormControl("", Validators.required),
  option : new FormControl("", Validators.required)
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
  this.db.list("/AssessmentList").push(Stype);
  this.db.list("/AssessmentsData/"+Stype).push(this.options);
  alert(Stype+" has been uploaded sucessfully.");
}


onAppend(input:string) {
let index = this.options.findIndex(option => option  === input);
if(index < 0) {
  this.options.push(input.trim());
  console.log(this.options);
}  else {
  alert("Duplicate Entry");
}
this.Submit.get('option').reset(" ");
}

onSave() {
  this.ngOnDestroy();
  let Stype = this.Submit.get('assessment').value;
  let ques =  this.Submit.get('question');
  let Ans = this.Submit.get('ans');
  this.db.list("/AssessmentsData/"+Stype).push({
    qa: ques.value,
    ans: Ans.value,
    options: this.options
  }).then(() => alert("data saved")), error => alert(error);
  Ans.reset();
  ques.reset();
  this.options = [];
}
onDelete(input) {
  let index = this.options.findIndex(option => option as string === input);
  if(index > -1) {
    this.options.splice(index, 1);
  } 
  }

signOut() {
  this.service.logOut();
}
ngOnDestroy() {
  this.subscribe.unsubscribe();
}
}
