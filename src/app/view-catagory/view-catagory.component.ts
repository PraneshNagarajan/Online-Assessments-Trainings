import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-catagory',
  templateUrl: './view-catagory.component.html',
  styleUrls: ['./view-catagory.component.css']
})
export class ViewCatagoryComponent implements OnInit {
  catagoryDatas = [];
  catagoryData = [];
  userName: string;
  size;
  media: any;
  schema;
  Flag;

  constructor(private mediaObserver: MediaObserver, private auth: AuthService, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        router.navigateByUrl('/adminPage');
      }
    });
    this.userName = sessionStorage.getItem('username');
    route.paramMap.subscribe(param => {
      this.schema = param.get('schema');
    });

    route.queryParamMap.subscribe(qparam => {
      this.Flag = qparam.get('flag');
    });
    this.db.list(this.schema).snapshotChanges().subscribe(catagories => {
      this.catagoryDatas = [];
      this.catagoryData = [];
      catagories.map(catagory => {
        this.catagoryDatas.push({ key: catagory.key, value: catagory.payload.val() });
      });
      this.catagoryDatas.map(datas => {
        let subcatagoryData = [];
        this.db.list('/' + this.schema + "/" + datas['key']).snapshotChanges().subscribe(data => {
          data.map(value => {
            subcatagoryData.push(value.key);
          });
          this.catagoryData.push({ catagory: datas.key, subcatagory: subcatagoryData });
          if (this.catagoryData.length === 0) {
            alert('No data found..');
            router.navigateByUrl('/adminPage');
          }
        });
      });
    });
  }
  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = '90%';
      }
      else if (change.mqAlias === 'sm') {
        this.size = '90%';
      }
      else if (change.mqAlias === 'md') {
        this.size = '70%';
      }
      else {
        this.size = '70%';
      }
    });
  }

  signOut() {
    this.auth.logOut();
  }
}
