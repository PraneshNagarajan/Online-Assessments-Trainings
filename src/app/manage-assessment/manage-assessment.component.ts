import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-assessment',
  templateUrl: './manage-assessment.component.html',
  styleUrls: ['./manage-assessment.component.css']
})
export class ManageAssessmentComponent implements OnInit, OnDestroy {
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
  topicsList = [];
  subIndex;
  align: string;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private auth: AuthService, private db: AngularFireDatabase, private router: Router) {
    router.events.subscribe( (event : NavigationStart) => {
    if(event.navigationTrigger === 'popstate') {
      router.navigateByUrl('/adminPage');
    }
    });
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
        this.align = "column";
      }
      else if (change.mqAlias === 'sm') {
        this.size = 90;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 1;
        this.top1 = "50%"
        this.bottom1 = "100%"
        this.align = "column";
      }
      else if (change.mqAlias === 'md') {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
        this.align = "row";
      }
      else {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
        this.align = "row";
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



  getTopic() {
    this.subscribe = this.db.list("/AssessmentDatas/" +this.catagory.value + '/' + this.subcatagory.value).snapshotChanges().subscribe(options => {
      this.topicsList = [];
      options.map(user => {
        this.topicsList.push({key: user.key, value: user.payload.val()});
      });
      if(this.topicsList.length === 0) {
        alert("No Assessmet found.\nPlease first add assessment under subcatagory: "+ this.subcatagory.value);
        this.Submit.reset();
      }
    });
  }
getAssessmentName() {
  this.subscribe = this.db.list("/AssessmentDatas/" +this.catagory.value + '/' + this.subcatagory.value +'/' + this.topic.value).snapshotChanges().subscribe(options => {
    this.combinedData = [];
    options.map(user => {
      this.combinedData.push(user.payload.val());
    });
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
    this.db.object("/AssessmentDatas/" +this.catagory.value + '/' + this.subcatagory.value + '/' + this.topic.value).set(this.combinedData).then(() => {
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


  onPreview() {
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

  onDelete(flag:string, input?) {
    let index = this.options.findIndex(option => option === input);
    if (flag === "option") {
      if (index > -1) {
        this.options.splice(index, 1);
      }
    } else if( flag === "delete") {
      let path = (this.topic.value as string).length > 0 ? this.subcatagory.value+'/'+this.topic.value : this.subcatagory.value;
      this.db.object('/AssessmentDatas/'+path).remove()
      .then(() => {
        alert("Deleted Successfully.");
        if(this.topicsList.length === 0) {
          this.router.navigateByUrl('/adminPage');
        }
      });    
    }
    else {
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

