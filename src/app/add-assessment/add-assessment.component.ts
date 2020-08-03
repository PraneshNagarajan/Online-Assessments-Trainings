import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.css']
})
export class AddAssessmentComponent implements OnInit, OnDestroy {
  media: Subscription;
  top;
  top1;
  bottom: string;
  bottom1;
  col;
  Loop = 0;
  size: number;
  listSize;
  options = [];
  loggedUser;
  subscribe: Subscription;
  combinedData = [];
  assessmentName: any;
  isPreview: boolean;
  isSelceted: boolean;
  next: boolean;
  back: boolean;
  SelOption: string;
  isChecked: boolean;
  catagoryList = [];
  subIndex;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private auth: AuthService, private db: AngularFireDatabase, private router: Router) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.db.list("/Catagories").snapshotChanges().subscribe( datas => {
      this.catagoryList = [];
      datas.map( data => {
        this.catagoryList.push(data.payload.val());
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = 90;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 1
        this.top1 = "50%"
        this.bottom1 = "100%"
      }
      else if (change.mqAlias === 'sm') {
        this.size = 90;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 1;
        this.top1 = "50%"
        this.bottom1 = "100%"
      }
      else if (change.mqAlias === 'md') {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
      }
      else {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
      }
    });
  }

  Submit = new FormGroup({
    catagory: new FormControl("", Validators.required),
    subcatagory:new FormControl("", Validators.required),
    topic: new FormControl("", Validators.required),
    assessment: new FormControl({ value: "", disabled: true }),
    question: new FormControl("", Validators.required),
    ans: new FormControl("", Validators.required),
    option: new FormControl("", Validators.required)
  });

  Update = new FormGroup({
    update: new FormControl("")
  })

  get catagory() {
    return this.Submit.get('catagory');
  }
  get subcatagory() {
    return this.Submit.get('subcatagory');
  }
  get topic() {
    return this.Submit.get('topic');
  }
  get update() {
    return this.Update.get('update');
  }

  get assessment() {
    return this.Submit.get("assessment");
  }

  getAssessmentName() {
    this.subscribe = this.db.list("/AssessmentsData/" +this.catagory.value + '/' + this.subcatagory.value).snapshotChanges().subscribe(options => {
      let i = 1;
      options.map(user => {
        ++i;
      });
      this.Submit.get('assessment').setValue("Assessment" + i);
    });
  }

  onSubmit() {
    let Ctime = moment().format("MM/DD/YYYY HH:mm:ss");
    let Stype = this.Submit.get('assessment').value;
    this.db.list('/AssessmentSubmissionTracker').push({
      add_info: {
        id: sessionStorage.getItem('DomainAdmin'),
        time: Ctime,
        name: Stype
      }
    });
    this.options.map(loc => {
      this.combinedData.splice(loc, 1);
    });
    this.db.list("/AssessmentList").push(Stype);
    this.db.list("/AssessmentsData/" +this.catagory.value + '/' + this.subcatagory.value + '/' + Stype+":-"+this.topic.value).push(this.combinedData).then(() => {
      alert(Stype + " has been uploaded sucessfully.");
      this.isPreview = false;
      this.Submit.reset();
      this.combinedData = [];
    });
  }

  getSubCatagory(index) {
    this.subIndex = index;
  }

  onAppend(input: string) {
    let index = this.options.findIndex(option => option === input.trim());
    if (index < 0) {
      this.options.push(input.trim());
    } else {
      alert("Duplicate Entry");
    }
    this.Submit.get('option').reset(" ");
  }

  onSave() {
    this.ngOnDestroy();
    let ques = this.Submit.get('question');
    let ans = this.Submit.get('ans');
    let option = this.Submit.get('option');
    this.combinedData.push({ qa: ques.value, ans: ((ans.value as string).trim()), options: this.options });
    ques.reset();
    ans.reset();
    option.reset();
    this.options = [];
  }

  onUpdate(qa, ans?, opt?, optindex?) {
    let index = this.combinedData.findIndex(data => data.qa === qa);
    if (!ans && !opt) {
      this.combinedData[index]['qa'] = (this.update.value as string);
    }
    else if (ans) {
      this.combinedData[index]['ans'] = (this.update.value as string);
    } else {
      this.combinedData[index]['options'][optindex] = (this.update.value as string);
    }
    this.SelOption = this.update.value;
    this.update.reset();
  }


  preview() {
    this.isPreview = true;
    this.options = [];
    if (this.combinedData.length - 1 === this.Loop) {
      this.next = true;
    }
  }

  onNext() {
    ++this.Loop;
    if (this.combinedData.length - 1 === this.Loop) {
      this.next = true;
    } else {
      this.next = false;
    }
    this.back = true;
    let index = this.options.findIndex(qa => qa === this.Loop);
    if (index > -1) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  onBack() {
    --this.Loop;
    if (this.Loop === 0) {
      this.back = false;
    } else {
      this.back = true;
    }
    this.next = false;
    let index = this.options.findIndex(qa => qa === this.Loop);
    if (index > -1) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  onDelete(input, flag) {
    let index = this.options.findIndex(option => option === input);
    if (flag === "option") {
      if (index > -1) {
        this.options.splice(index, 1);
      }
    } else {
      if (index > -1) {
        this.options.splice(index, 1);
      } else {
        this.options.push(input);
      }
    }
  }

  signOut() {
    this.auth.logOut();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}

