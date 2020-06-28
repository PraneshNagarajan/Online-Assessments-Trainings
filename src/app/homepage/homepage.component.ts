import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent  {
  user;
  constructor(private router:Router) {
    if (localStorage.getItem('GingerUser')) {
      this.user = 'GingerUser';
    }
    else if(localStorage.getItem('GingerAdmin')) {
      this.user = 'GingerAdmin';
    }
  }
  onAuth() {
    if (localStorage.getItem('GingerUser')) {
        this.router.navigate(['/main']);
    } else {
      this.router.navigate(['']);
    }
  }

}
