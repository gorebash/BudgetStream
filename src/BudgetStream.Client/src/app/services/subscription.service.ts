import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http:HttpClient) { }

  addPushSubscriber (subscriber:any):Observable<any> {
    return this.http.post(`/api/subscribe`, subscriber);
  }

  sendNotifications(message:any):Observable<any> {
    return this.http.post(`/api/sendNotifications`, message);
  }
}