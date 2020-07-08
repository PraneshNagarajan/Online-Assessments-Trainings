import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  media: Subscription;
  deviceXs;
  deviceSm;
  deviceMd;
  deviceLg;
  deviceWidth;
  deviceHeight;
  next:boolean;
  back: boolean;
  dbsize;
  plist = 1;
  videoList = [];

  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private router: Router, private service: DataService, private db: AngularFireDatabase) {
    this.db.list('/VideoTraining').snapshotChanges().subscribe(video => {
      let i = 0;
      this.dbsize = video.length;
      video.map( list => {
        this.videoList.push({id : ++i, playlist: list.payload.val()});
      });
    });
   }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.deviceXs = true;
        this.deviceHeight = 100;
        this.deviceWidth = 300;
      } 
      else if(change.mqAlias === 'sm') {
        this.deviceXs = false;
        this.deviceSm = true;
        this.deviceHeight = 200;
        this.deviceWidth = 480;
      }
      else if (change.mqAlias === 'md') {
        this.deviceMd = true;
        this.deviceHeight = 340;
        this.deviceWidth = 600;
      }
      else {
        this.deviceLg = true;
        this.deviceHeight = 400;
        this.deviceWidth = 880;
      }
      //this.deviceXs = (change.mqAlias === 'xs') ? true: false;
      //this.deviceWidth = (this.deviceXs)? 300: 880;
      //this.deviceHeight = (this.deviceXs)? 100: 400;

    });
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

onNext() {
  ++this.plist;
  if(this.plist === this.dbsize) {
  this.next = !this.next;
  }
}

onBack() {
  --this.plist;
  if(this.plist === this.dbsize) {
  this.back =  !this.back;
  }
}
  signOut() {
    this.service.logOut();
  }

}
