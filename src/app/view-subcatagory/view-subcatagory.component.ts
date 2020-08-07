import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-view-subcatagory',
  templateUrl: './view-subcatagory.component.html',
  styleUrls: ['./view-subcatagory.component.css']
})
export class ViewSubcatagoryComponent implements OnInit {
  topicData = [];
  topicDatas = [];
  userName: string;
  size;
  media: any;
  catagory: string;
  subcatagory: string;
  schema: string;
  routerName;
  routerParams;
  Flag: string;
  Flag1: string;

  constructor(private mediaObserver: MediaObserver, private auth: AuthService, private route: ActivatedRoute, private db: AngularFireDatabase, private router: Router) {
    route.paramMap.subscribe(param => {
      this.schema = param.get('schema');
      this.catagory = param.get('catagory');
      this.subcatagory = param.get('subcatagory');
      this.routerName = (this.schema === 'Videos') ? '/videoTutorial' : '/viewAssessments';
    });
    route.queryParamMap.subscribe(qparam => {
      console.log(this.Flag);
      this.Flag1 = (this.Flag.match('manage')) ? 'manage' : 'view';
    });
    router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        router.navigateByUrl("/viewCatagories/" + this.schema + '?flag=' + this.Flag);
      }
    });
    this.userName = sessionStorage.getItem('username');
    this.db.list("/" + this.schema + "/" + this.catagory + "/" + this.subcatagory).snapshotChanges().subscribe(subcatagories => {
      this.topicData = [];
      this.topicDatas = [];
      subcatagories.map(topic => {
        this.topicData.push(topic.key);
      });
      this.topicDatas.push({ catagory: this.catagory, subcatagory: this.subcatagory, topics: this.topicData });
      if (this.topicDatas.length === 0) {
        alert("No data found..");
        router.navigateByUrl('/adminPage');
      }
    });
  }
  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = '90%';
      }
      else if (change.mqAlias === 'sm') {
        this.size = '90%';
      }
      else if (change.mqAlias === 'md') {
        this.size = '70%';
      }
      else {
        this.size = '70%';
      }
    });
  }

  signOut() {
    this.auth.logOut();
  }
}
