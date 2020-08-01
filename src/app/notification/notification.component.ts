import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  datas = [];
  isClicked;
  loggedUser: string;
  admin: boolean;
  userName: string;
  size;
  media: any;
  notification = [];
  notifications = [];
  notify = [];
  subscription: Subscription;
  loc;

  constructor(private mediaObserver: MediaObserver, private auth: AuthService, private navigation: Location ,private service: DataService, private db: AngularFireDatabase, private router: Router) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
      this.admin = true;
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.userName = sessionStorage.getItem('username');
    navigation.subscribe(() => location.reload());

   this.subscription = this.db.list("/notifications").snapshotChanges()
      .subscribe( datas => {
        datas.map( data => {
          this.notifications.push({key: data.key, value: data.payload.val()});
      });
      if(this.notification.length > 0) {
      this.notifications.map( data => {
        this.notify = data['value']['users'];
        let j = -1;
          this.notify.map(user => {
            ++j;
            if (user['id'] === this.loggedUser) {
              if (user['status'] === "Unread") {
                this.loc = j;
              }
              this.notification.push({
                status: user['status'],
                date: data['value']['date'],
                time: data['value']['time'],
                duration: data['value']['duration'],
                name: data['value']['name'],
                assessment_key: data['value']['key'],
                title: data['value']['title'],
                scheduled_by: data['value']['scheduled_by'],
                index: this.loc,
                table_key: data['key']
              });
            }
          });
      });
      this.notify = this.notification;
      this.notifications = [];
      this.notification = [];
    } else {
      alert("you didn't get any notifications yet");
      this.router.navigateByUrl('/homePage');
    }
    });
    
   }
 ngOnInit() {
  this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
    if(change.mqAlias === 'xs') {
      this.size = '100%';
    } 
    else if(change.mqAlias === 'sm') {
      this.size = '100%';
    }
    else if (change.mqAlias === 'md') {
      this.size = '70%';
    }
    else {
      this.size = '70%';
    }
});
 }
   onClick(loc) {
     if(this.notify[loc]['status'] !== "Read") {
     this.notify[loc]['status'] = "Read";
     let refDB = this.db.database.ref('/notification/' + this.notify[loc]['table_key']);
      refDB.child('users').child(this.notify[loc]['index']).update({
      status: "Read"
    });
  }
   }

   signOut() {
    this.auth.logOut();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
