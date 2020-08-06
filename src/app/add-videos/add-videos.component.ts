import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.css']
})
export class AddVideosComponent implements OnInit, OnDestroy {
  media: Subscription;
  DB: Subscription;
  top;
  top1;
  bottom: string;
  bottom1;
  col;
  size: number;
  loggedUser: string;
  videoList = [];
  userName: string;
  catagoryList: any[];
  subIndex: any;

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
    this.userName = sessionStorage.getItem('username');
    this.DB = this.db.list('/Videos').valueChanges().subscribe(datas => {
      this.videoList = [];
      datas.map(data => {
        this.videoList.push(data);
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

  Video = new FormGroup({
    catagory: new FormControl("", Validators.required),
    subcatagory:new FormControl("", Validators.required),
    topic: new FormControl("", Validators.required),
    title1: new FormControl("", Validators.required),
    title2: new FormControl("", Validators.required),
    videoid: new FormControl("", Validators.required),
  });

  get catagory() {
    return this.Video.get('catagory');
  }
  get subcatagory() {
    return this.Video.get('subcatagory');
  }
  get topic() {
    return this.Video.get('topic');
  }
  getSubCatagory(index) {
    this.subIndex = index;
  }
  onUpload(id, t1, t2) {
     this.db.list('/Videos/'+this.catagory.value + '/' + this.subcatagory.value + '/' +this.topic.value).push({
      title1: t1,
      title2: t2,
      videoid: id
     })
     .then((data) => {
       this.db.list('/ManageVideos').push({
        tid: data.key,
        status: 'Added',
        removed_by: this.loggedUser,
        date_time: moment(moment.now()).format("MM/DD/YYYY HH:mm:ss")
       });
       alert("Data saved successfully.")})
     .catch(error => alert(error));
  }

  onAdd() {
    let id = this.Video.get('videoid').value;
    let t1 = this.Video.get('title1').value;
    let t2 = this.Video.get('title2').value;
      if (this.videoList.length > 0) {
        this.videoList.map(video => {
          if (video['videoid'] !== id) {
            this.onUpload(id, t1, t2);
          } else {
            alert("Already video found. Please check your id.");
          };
        });
      } else {
        this.onUpload(id, t1, t2);
      }
    this.Video.reset();
  }

  signOut() {
    this.auth.logOut();
  }
  ngOnDestroy() {
    this.DB.unsubscribe();
  }
}

