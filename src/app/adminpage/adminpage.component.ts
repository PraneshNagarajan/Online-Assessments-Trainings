import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})
export class AdminpageComponent implements OnInit {
  Arole;
  userName;
  isSpinner: boolean;
  userDatas = [];
  deviceXs: boolean;
  device;
  deviceStyle ="row";
  media: Subscription;
  roles = [
    { name: 'admin' },
    { name: 'user' }
  ];
  subscription: Subscription;
  deviceHeight: number;
  deviceWidth: number;

  constructor(private mediaObserver: MediaObserver,private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService) {
    this.subscription = db.list('/UserInfo').snapshotChanges()
    .subscribe(user => {
      this.userName = localStorage.getItem('username');
      user.map(data => {
        this.userDatas.push({ id: data.key, value: data.payload.val() });
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      console.log(change.mqAlias);
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

      //this.deviceXs = device.mqAlias === 'xs' ? '90%' : '35%';
      //this.deviceStyle = (device.mqAlias === 'xs') ? 'column' : 'row';
    });
  }

  onUpdate(id, sel_role) {
    this.db.object('/UserInfo/' + id+'/account').update({ roles: sel_role }).then(() => {
      let index = this.userDatas.findIndex(user => user['id'] === id);
      this.userDatas[index]['value']['account']['role'] = sel_role;
      alert("Updated Sucessfully");
    }, error => {
      alert(error);
    });
  }

  onDelete(id) {
    this.db.object('/UserInfo/' + id).remove().then(() => {
      let index = this.userDatas.findIndex(user => user['id'] === id);
      console.log(index);
      this.userDatas.splice(index, 1);
      alert('Successfully deleted')
    }, error => {
      alert(error);
    });
  }

  signOut() {
    this.service.logOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
