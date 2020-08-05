import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import * as moment from 'moment';

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
  users = [];
  loggedUser: string;
  
  constructor(private mediaObserver: MediaObserver,private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService, private auth: AuthService) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    } 
    this.userName = sessionStorage.getItem('username');
    db.list('/UserInfo').snapshotChanges()
    .subscribe(user => {
      this.userDatas = [];
      user.map(data => {
        this.userDatas.push({ id: data.key, value: data.payload.val() });
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

  onUpdate(id, sel_role) {
    this.db.object('/UserInfo/' + id+'/account').update({ role: sel_role }).then(() => {
      let index = this.userDatas.findIndex(user => user['id'] === id);
      this.userDatas[index]['value']['account']['role'] = sel_role;
      alert("Updated Sucessfully");
    }, error => {
      alert(error);
    });
  }

  onDelete(id, tid) {
    this.db.object('/ManageUsers/'+tid).update({
      status: 'Removed',
      removed_by: this.loggedUser,
      date_time: moment(moment.now()).format("MM/DD/YYYY HH:mm:ss")
    });
    this.db.object('/UserInfo/' + id).remove().then(() => {
      let index = this.userDatas.findIndex(user => user['id'] === id);
      this.userDatas.splice(index, 1);
      alert('Successfully deleted')
    }, error => {
      alert(error);
    });
  }

  signOut() {
    this.auth.logOut();
  }

}
