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
    if (localStorage.getItem('DomainUser')) {
      this.user = 'DomainUser';
    }
    else if(localStorage.getItem('DomainAdmin')) {
      this.user = 'DomainAdmin';
    }
  }
  onAuth() {
    if (localStorage.getItem('DomainUser') || localStorage.getItem('DomainAdmin')) {
        this.router.navigate(['/main']);
    } else {
      this.router.navigate(['']);
    }
  }

}
