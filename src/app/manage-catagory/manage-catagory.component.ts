import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-catagory',
  templateUrl: './manage-catagory.component.html',
  styleUrls: ['./manage-catagory.component.css']
})
export class ManageCatagoryComponent implements OnInit {
  catagoryList = [];
  key;
  subIndex;
  loggedUser: string;
  device: number;
  media: any;

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
        this.catagoryList.push({id: data.key, value: data.payload.val()});
      });
    });
  }
 
  Catagories = new FormGroup({
  catagory: new FormControl(""),
  catagory1: new FormControl(""),
  subcatagory: new FormControl(""),
  subcatagory1: new FormControl("")
  });

get catagory() {
  return this.Catagories.get('catagory');
}

get catagory1() {
  return this.Catagories.get('catagory1');
}

get subcatagory() {
  return this.Catagories.get('subcatagory');
}

get subcatagory1() {
  return this.Catagories.get('subcatagory1');
}

  ngOnInit(){
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.device = 90;
      } 
      else if(change.mqAlias === 'sm') {
        this.device = 60;
      }
      else if (change.mqAlias === 'md') {
        this.device = 35;
      }
      else {
        this.device = 35;
      }
    });
  }

  getSubCatagory(index) {
    this.subIndex = index;
  }

  getId(id) {
    this.key = id;
  }
  onUpdate(id) {
    let index = this.catagoryList.findIndex( data => data.catagory === this.catagory.value);
    let index1;
    let data = [];
    if(((this.catagory1.value as string).length > 0)&&((this.subcatagory1.value as string).length > 0)){
          let Subcatagory:any[] = this.catagoryList[index]['value']['subcatagory'];
          index1 = Subcatagory.findIndex(data => data === this.subcatagory.value);
          this.catagoryList[index]['value']['catagory'] = this.catagory1.value;
          this.catagoryList[index]['value']['subcatagory'][index1] = this.subcatagory1.value;
          data.push({catagory: this.catagory1.value, subcatagory: [this.subcatagory1.value]});
    } else if((this.catagory1.value as string).length > 0) {
          this.catagoryList[index]['value']['catagory'] = this.catagory1.value;
          data.push({catagory: this.catagory1.value});
    } else {
      let Subcatagory:any[] = this.catagoryList[index]['value']['subcatagory'];
          index1 = Subcatagory.findIndex(data => data === this.subcatagory.value);
          this.catagoryList[index]['value']['subcatagory'][index1] = this.subcatagory1.value;
          data.push({subcatagory:[this.subcatagory1.value]});
    }
    this.db.object('/Catagories'+'/'+this.key).update(data).then(() => {
      alert('Updated Successfully');
    }, error => {
      alert(error);
    });
  }

  onDelete(id) {
    this.db.object('/Catagories/'+this.key).remove().then(() => {
      let index = this.catagoryList.findIndex(video => video['id'] === id);
      this.catagoryList.splice(index, 1);
      alert('Successfully deleted')
    }, error => {
      alert(error);
    });
  }

  signOut() {
    this.auth.logOut();
  }
}
