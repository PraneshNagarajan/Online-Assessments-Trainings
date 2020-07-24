import { Injectable } from '@angular/core';
import {Http, Headers} from  '@angular/http'

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: Http) { }
}
