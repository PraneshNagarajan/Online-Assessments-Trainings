import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnDestroy {
  Urole;
  Arole;
  isSpinner:boolean;
  datas = [];
  subscription: Subscription;
  roles = [
    { name: 'admin' },
    { name: 'user' }
  ];

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService) {
    this.subscription = db.list('/RegisterTable').snapshotChanges()
    .subscribe(user => {
      user.map(data => {
        this.datas.push({ id: data.key, value: data.payload.val() });
      });
    });
  if(localStorage.getItem('GingerUser')) {
    this.Urole = 'GingerUser';
  } else {
    this.Arole = 'GingerAdmin';
  }
  }

  signOut() {
    this.afAuth.auth.signOut();
    if(localStorage.getItem('GingerUser')) {
      localStorage.removeItem('GingerUser');
    } else {
      localStorage.removeItem('GingerAdmin');
    }
        this.router.navigate(['']);
  }

  onUpdate(id, sel_role) {
    console.log("role : ", sel_role);
    this.db.object('/RegisterTable/' + id).update({ role: sel_role }).then(() => {
      let index = this.datas.findIndex(user => user['id'] === id);
      console.log(this.datas[index]);
      this.datas[index]['value']['role'] = sel_role;
      alert("Updated Sucessfully");
    }, error => {
      alert(error);
    });
  }

  onDelete(id) {
    console.log(id);
    this.db.object('/RegisterTable/' + id).remove().then(() => {
      let index = this.datas.findIndex(user => user['id'] === id);
      console.log(index);
      this.datas.splice(index, 1);
      alert('Successfully deleted')
    }, error => {
      alert(error);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
