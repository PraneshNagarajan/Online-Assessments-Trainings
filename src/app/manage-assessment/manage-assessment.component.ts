import { Component, OnInit } from '@angular/core';
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
export class ManageAssessmentComponent implements OnInit {
  routerParams: string;
  loggedUser: string;
  userName: string;
  media: Subscription;
  deviceXs: boolean;
  deviceStyle: string;
  device: number;
  catagory;
  subcatagory;
  topics = [];
  schema;


  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute, private service: DataService, private auth: AuthService) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.userName = sessionStorage.getItem('username');
    router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        router.navigateByUrl('/viewCatagories/AssessmentDatas' + '?flag=manageAssessments');
      }
    });
    route.paramMap.subscribe(param => {
      this.routerParams = param.get('catagory') + '/' + param.get('subcatagory');
      this.schema = param.get('schema');
      this.catagory = param.get('catagory');
      this.subcatagory = param.get('subcatagory');
    });


    db.list('/AssessmentDatas/' + this.routerParams).snapshotChanges().subscribe(datas => {
      this.topics = [];
      datas.map(data => {
        this.topics.push(data.key);
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.deviceXs = true;
        this.deviceStyle = "column";
        this.device = 90;
      }
      else if (change.mqAlias === 'sm') {
        this.device = 60;
        this.deviceXs = false;
      }
      else if (change.mqAlias === 'md') {
        this.device = 35;
      }
      else {
        this.device = 35;
      }
    });
  }

  assessment = new FormGroup({
    catagory: new FormControl(""),
    topic: new FormControl("", Validators.required)
  });

get Catagories() {
return this.assessment.get('catagory');
} 

get Topic() {
  return this.assessment.get('topic').value;
}
  onReset() {
    this.Catagories.reset();
  }

  onDelete() {
    let path = (this.Catagories.value === 1)? this.catagory: this.catagory+'/'+this.subcatagory;
    if(this.Catagories.value > 0){
      this.db.object('/AssessmentDatas/'+ path).remove()
      .then(() => {
        this.db.list('/ManageAssessments').push({
          deleted_by : this.loggedUser,
          date: moment().format("MM/DD/YYYY HH:mm:ss"),
          name: path
        });
        alert('Deleted Successully.');
      });
    } else {
      this.db.object('AssessmentDatas/'+this.routerParams+'/'+this.Topic).remove()
      .then(() => {
        this.db.list('/ManageAssessments').push({
          deleted_by : this.loggedUser,
          date: moment().format("MM/DD/YYYY HH:mm:ss"),
          name: 'AssessmentDatas/'+this.routerParams+'/'+this.Topic.value
        });
        alert('Deleted Successully.');
      });
    }
    if(this.topics.length === 0){
      this.router.navigateByUrl('/viewCatagories/AssessmentDatas' + '?flag=manageAssessments');
    }
    location.reload();
  }

  signOut() {
    this.auth.logOut();
  }
}
