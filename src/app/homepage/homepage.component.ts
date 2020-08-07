import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  loggedUser;
  media: any;
  size: number;
  top: string;
  bottom: string;
  mode: string;
  sytle: string;
  style: string;
  userName: string;
  datas = [];
  count = 0;
  admin: boolean;
  notification = [];
  notifications = [];

  constructor( private db: AngularFireDatabase, private router:Router, private mediaObserver: MediaObserver, private service: DataService, private auth: AuthService) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
      this.admin = true;
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.userName = sessionStorage.getItem('username');

    this.db.list("/notifications").snapshotChanges()
      .subscribe( datas => {
        this.notifications = [];
        datas.map( data => {
          this.notifications.push({key: data.key, value: data.payload.val()});
      });
      this.notifications.map( data => {
        let notify = data['value']['users'];
          notify.map(user => {
            if (user['id'] === this.loggedUser) {
              if (user['status'] === "Unread") {
                ++this.count;
              }
            }
          });
      });
      });
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
        this.size = 35;
        this.style ="null"
        this.top="10%"
        this.bottom="100%"
      }
      else {
        this.mode ="row";
        this.size = 35;
        this.style ="null"
        this.top="10%"
        this.bottom="100%"
      }
  });
  }
  navigation(url) {
    this.router.navigateByUrl(url).then(() => location.reload());
  }

  signOut() {
    this.auth.logOut();
  }
}
