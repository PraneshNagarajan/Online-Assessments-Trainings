import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CapsValidators } from '../Validators/Caps.validators';
import { LowerCaseValidators } from '../Validators/lower-case.validators';
import { SpecialCharacterValidators } from '../Validators/specialCharacter.validators';
import { WhiteSpaceValidators } from '../Validators/whiteSpace.validators';

@Component({
  selector: 'app-catagory',
  templateUrl: './catagory.component.html',
  styleUrls: ['./catagory.component.css']
})
export class CatagoryComponent implements OnInit, OnDestroy {
  media: Subscription;
  DB: Subscription;
  top;
  top1;
  bottom: string;
  bottom1;
  col;
  size: number;
  loggedUser: string;
  catagoryList = [];
  subcatagoryList = [];
  userName: string;
  isFound: boolean = true;
  isFound1: boolean = true;

  constructor(private mediaObserver: MediaObserver, private service: DataService, private auth: AuthService, private db: AngularFireDatabase, private router: Router) {
    if (sessionStorage.getItem('DomainAdmin')) {
      this.loggedUser = sessionStorage.getItem('DomainAdmin');
    } else {
      this.loggedUser = sessionStorage.getItem('DomainUser')
    }
    this.userName = sessionStorage.getItem('username');
    this.db.list('/Catagories').snapshotChanges().subscribe(datas => {
      this.catagoryList = [];
      datas.map(data => {
        this.catagoryList.push({ key: data.key, value: data.payload.val() });
      });
    });
  }

  ngOnInit() {
    this.media = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.size = 90;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 1
        this.top1 = "50%"
        this.bottom1 = "100%"
      }
      else if (change.mqAlias === 'sm') {
        this.size = 90;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 1;
        this.top1 = "50%"
        this.bottom1 = "100%"
      }
      else if (change.mqAlias === 'md') {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
      }
      else {
        this.size = 80;
        this.top = "5%"
        this.bottom = "100%"
        this.col = 2;
        this.top1 = "5%"
        this.bottom1 = "100%"
      }
    });
  }

  form = new FormGroup({
    subcatagory: new FormControl("",
      [
        Validators.required,
        CapsValidators.firstCaps,
        LowerCaseValidators.foundText,
        WhiteSpaceValidators.noSpace
      ]),
    catagory: new FormControl("",
      [
        Validators.required,
        CapsValidators.firstCaps,
        LowerCaseValidators.foundText,
        WhiteSpaceValidators.noSpace
      ])
  });

  get catagory() {
    return this.form.get('catagory');
  }
  get subcatagory() {
    return this.form.get('subcatagory');
  }
  onUpload(c) {
    this.subcatagoryList.push(this.subcatagory.value);
    this.db.list('/Catagories').push({
      catagory: c,
      subcatagory: this.subcatagoryList
    }).then(() => alert("Saved data successfully"));
  }

  onAdd() {
    let c = (this.catagory.value as string).trim();
    let sc = (this.subcatagory.value as string).trim();
    let j = 0;
    if (this.catagoryList.length > 0) {
      this.catagoryList.map(Catagory => {
        ++j;
        if (Catagory['value']['catagory'] === c) {
          let subcat: any[] = Catagory['value']['subcatagory'];
          let i = 0;
          this.isFound = false;
          this.subcatagoryList = [];
          subcat.map(list => {
            i++;
            this.subcatagoryList.push(list);
            if (list === sc) {
              this.isFound1 = false;
              this.subcatagoryList.push(this.subcatagory.value);
            }
          });
          if (i === subcat.length) {
            if (this.isFound1 !== false && !this.isFound) {
              this.subcatagoryList.push(this.subcatagory.value);
              this.db.object("/Catagories/" + Catagory.key).update({
                subcatagory: this.subcatagoryList
              }).then(() => alert("Saved data successfully"));
            } else if (this.isFound) {
              this.onUpload(c);
            } else {
              alert("Already subcatagory: +"+this.subcatagory.value+" is present under "+ this.catagory.value);
            }
          }
        } else if (j === this.catagoryList.length) {
          this.onUpload(c);
        }
      });
    } else {
      this.onUpload(c);
    }
    this.isFound = true;
    this.isFound1 = true;
    this.form.reset();
  }

  signOut() {
    this.auth.logOut();
  }
  ngOnDestroy() {
    this.DB.unsubscribe();
  }
}