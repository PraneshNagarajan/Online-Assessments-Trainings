import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DataService } from '../data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  user;
  media: any;
  size: number;
  top: string;
  bottom: string;
  mode: string;
  sytle: string;
  style: string;
  userName: string;
  datas = [];

  constructor(private router:Router, private mediaObserver: MediaObserver, private service: DataService) {
    if (sessionStorage.getItem('DomainUser')) {
      this.user = 'DomainUser';
    }
    else if(sessionStorage.getItem('DomainAdmin')) {
      this.user = 'DomainAdmin';
    }
    this.userName = sessionStorage.getItem('username');
  }
  
  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.mode ="column";
        this.size = 100;
        this.style ="space-around"
        this.top="50%"
        this.bottom="100%"
      } 
      else if(change.mqAlias === 'sm') {
        this.mode ="column";
        this.size = 100;
        this.style ="stretch"
        this.top="50%"
        this.bottom="100%"
      }
      else if (change.mqAlias === 'md') {
        this.mode ="row";
        this.size = 30;
        this.style ="null"
        this.top="10%"
        this.bottom="100%"
      }
      else {
        this.mode ="row";
        this.size = 30;
        this.style ="null"
        this.top="10%"
        this.bottom="100%"
      }
  });
  }
  navigation(url) {
    this.router.navigateByUrl(url).then(() => location.reload());
  }
  call() {
    this.datas = this.service.getAssessment("Assessment7");
  }
  signOut() {
    this.service.logOut();
  }
}
