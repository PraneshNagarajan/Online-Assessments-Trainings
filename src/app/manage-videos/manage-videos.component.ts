import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-videos',
  templateUrl: './manage-videos.component.html',
  styleUrls: ['./manage-videos.component.css']
})
export class ManageVideosComponent implements OnInit {
  userName;
  isSpinner: boolean;
  videoDatas = [];
  deviceXs: boolean;
  device;
  deviceStyle ="row";
  media: Subscription;
  DB: Subscription;
  loggedUser: string;
  routeBack: string;
  routeParameters: string;
  
  constructor(private mediaObserver: MediaObserver,private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService, private route:ActivatedRoute,private auth: AuthService) {
    router.events.subscribe( (event : NavigationStart) => {
      if(event.navigationTrigger === 'popstate') {
        router.navigateByUrl('/viewSubcatagories/'+this.routeBack+'?flag=manageVideos');
      }
      });
      this.route.paramMap.subscribe(param => {
        this.routeBack = param.get('schema') + '/' + param.get('catagory') + '/' + param.get('subcatagory');
        this.routeParameters = param.get('catagory') + '/' + param.get('subcatagory') + '/' + param.get('topic');
      });
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    } 
    this.userName = sessionStorage.getItem('username');
    db.list('/Videos/'+this.routeParameters).snapshotChanges()
    .subscribe(video => {
      this.videoDatas = [];
      video.map(data => {
        this.videoDatas.push({ id: data.key, value: data.payload.val() });
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.deviceXs = true;
        this.deviceStyle = "column";
        this.device = 90;
      } 
      else if(change.mqAlias === 'sm') {
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

  onUpdate(id, T1, T2) {
    this.db.object('/Videos/' + id).update({ 
      title1: T1,
      title2: T2
     }).then(() => {
      alert("Updated Sucessfully.\nTitle1: "+T1+"\nTitle2 :"+T2);
    }, error => {
      alert(error);
    });
  }

  onDelete(id, tid) {
    this.db.object('/ManageVideos/'+tid).update({
      status: 'Removed',
      removed_by: this.loggedUser,
      date_time: moment(moment.now()).format("MM/DD/YYYY HH:mm:ss")
    });
    this.db.object('/Videos/' + id).remove().then(() => {
      let index = this.videoDatas.findIndex(video => ['videoid'] === id);
      this.videoDatas.splice(index, 1);
      alert('Successfully deleted')
    }, error => {
      alert(error);
    });
  }

  signOut() {
    this.auth.logOut();
  }


}
