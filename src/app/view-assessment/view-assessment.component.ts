import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.css']
})
export class ViewAssessmentComponent implements OnInit {
  media: Subscription;
  top;
  top1;
  bottom: string;
  bottom1;
  col;
  Loop = 0;
  size: number;
  assessmentData = [];
  assessmentDatas = [];
  isSelceted: boolean;
  next: boolean;
  back: boolean;
  SelOption: string;
  isChecked: boolean;
  routeParameters;
  routeBack;
  options =[];
  userName: string;

  constructor(private mediaObserver: MediaObserver, private router: Router, private auth: AuthService, private db: AngularFireDatabase, private route:ActivatedRoute) {
    this.userName = sessionStorage.getItem('username');
    this.route.paramMap.subscribe( param => {
      this.routeBack= param.get('catagory')+'/'+param.get('subcatagory');
      this.routeParameters = param.get('catagory')+'/'+param.get('subcatagory')+'/'+param.get('topic');
    });
    router.events.subscribe( (event : NavigationStart) => {
      if(event.navigationTrigger === 'popstate') {
        router.navigateByUrl('/subcatagories/'+this.routeBack);
      }
      });
    this.db.list('AssessmentsData/'+this.routeParameters).snapshotChanges().subscribe( datas => {
      this.assessmentData = [];
      this.assessmentDatas = [];
      datas.map( data => {
        this.assessmentDatas.push({key: data.key, value: data.payload.val()});
        this.routeParameters = this.routeParameters+'/'+data.key;
      });
      this.assessmentDatas.map( datas => {
        let data: any[] = datas['value'];
        data.map( values => {
          this.assessmentData.push(values);
        });
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

  Update = new FormGroup({
    update: new FormControl("")
  });

  get update() {
    return this.Update.get('update');
  }
  onUpdate(qa, ans?, opt?, optindex?) {
    let index = this.assessmentData.findIndex(data => data.qa === qa);
    if (!ans && !opt) {
      this.assessmentData[index]['qa'] = (this.update.value as string);
    }
    else if (ans) {
      this.assessmentData[index]['ans'] = (this.update.value as string);
    } else {
      this.assessmentData[index]['options'][optindex] = (this.update.value as string);
    }
    this.SelOption = this.update.value;
    this.update.reset();
  }

  onSubmit() {
    this.options.map(loc => {
      this.assessmentData.splice(loc, 1);
    });
    this.db.object("/AssessmentsData/" +this.routeParameters).set(this.assessmentData).then(() => {
      alert("Updated sucessfully.");
      this.assessmentData = [];
      this.router.navigateByUrl("/viewSubcatagories/"+this.routeBack);
    });
  }


  onNext() {
    ++this.Loop;
    if (this.assessmentData.length - 1 === this.Loop) {
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

  onDelete(input) {
    let index = this.options.findIndex(option => option === input);
      if (index > -1) {
        this.options.splice(index, 1);
      } else {
        this.options.push(input);
      }
      console.log(this.options);
  }

  signOut() {
    this.auth.logOut();
  }
}

