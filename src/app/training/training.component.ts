import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
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

  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private router: Router, private service: DataService) { }

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
        this.deviceWidth = 740;
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

  signOut() {
    this.service.logOut();
  }

}
