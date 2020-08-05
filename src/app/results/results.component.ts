import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Subscription } from 'rxjs';

export interface UserData {
  no: string;
  date: string;
  catagory: string;
  subcatagory: string;
  topic: string;
  assessment: string,
  mark: string
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['no', 'date', 'catagory', 'subcatagory', 'topic', 'assessment', 'mark'];
  dataSource: MatTableDataSource<UserData>;

  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];
  public barChartLabels: Label[];
  public barChartOptions: ChartOptions;
  public barChartType: ChartType;
  public barChartLegend;
  userName: string;
  loggedUser: string;
  results = [];
  result = [];
  marks= [];
  combinedData = [];
  admin: boolean;
  isSelected: boolean;
  media: Subscription;
  width: string;
  userList= [];
  size;
  top: string;

  constructor(private mediaObserver: MediaObserver, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router, private service: DataService, private auth: AuthService) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
      this.admin = true;
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    window.addEventListener('resize', ev => {
      location.reload();
    });
    this.db.list('/ManageUsers').snapshotChanges().subscribe(datas => {
      let users =[]; 
      this.userList = [];
      datas.map(data => {
        users.push(data.payload.val());
      });
      users.map( user => {
        if(user['status'] !== 'Removed') {
          this.userList.push(user['userid']);
        }
      });
    });
    this.userName = sessionStorage.getItem('username');
    this.getResult();
}

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe( (change: MediaChange) => {
      if(change.mqAlias === 'xs') {
        this.top = '5%';
        this.width="100%"
        this.size = 10;
      } 
      else if(change.mqAlias === 'sm') {
        this.width="100%"
        this.size = 10;
      }
      else if (change.mqAlias === 'md') {
        this.width="50%";
        this.size = 5;
      }
      else {
        this.width="50%";
        this.size = 5;
      }
  });
  }

  getResult(user?) {
    this.db.list('/AssessmentResultsTracker').snapshotChanges().subscribe(datas => {
      this.results = [];
      this.result = [];
      this.combinedData = [];
      let scores = [];
      let label = [];
      datas.map( data => {
        this.results.push(data.payload.val());
      });
      this.results.map(datas => {
        if(user) {
        if (datas['id'] === user) {
          this.result.push(datas);
          console.log(this.results);
        }
      } else {
        if (datas['id'] === this.loggedUser) {
          this.result.push(datas);
        }
      }
      });
      let i = 0;
      this.result.map( datas => {
        this.marks = [datas['result']];
       this.marks.map( data => {
          this.combinedData.push({
            no: ++i, 
            catagory: data['catagory'],
            subcatagory: data['subcatagory'],
            topic: data['topic'],
            assessment: data['assessment'],
            date: data['date'],
            mark: data['mark']
          });
          let tmark = Number((data['mark'] as string).split('/')[1]);
          let gmark = Number((data['mark'] as string).split('/')[0]);
          let percentage = (gmark/tmark)*100;
          scores.push(percentage);
          label.push(data['date']);
        });
        this.isSelected = true;
        this.getChart((user)? user:this.loggedUser, label, [{data: scores, label: 'marks'}]);
        this.dataSource = new MatTableDataSource(this.combinedData);
      });
      this.dataSource.paginator = this.paginator;
    });
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getChart(user:string,labels, data) {
    this.barChartOptions = {
      title: {
        text: 'Marks of '+user.split('@')[0],
        position: 'top',
        fontSize: 20,
        fontColor: 'purple',
        fontStyle: 'bold',
        display: true
      },
      legend: {
        position: 'bottom'
      },
      responsive: true,
      scales: { xAxes: [{}], yAxes: [{
        ticks:{
          max: 100,
          min: 0,
          stepSize: 10
        }
      }] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.barChartLabels = labels;
    this.barChartType = 'bar';
    this.barChartLegend = true;

    this.barChartData = data;
  }
  signOut() {
    this.auth.logOut();
  }
}
