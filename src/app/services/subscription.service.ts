import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http:HttpClient) { }

  addPushSubscriber (user:User):Observable<any> {
    var baseUri = environment.baseUri_notificationService;
    return this.http.post(`${baseUri}api/AddSubscriber`, {
      id: user.documentId,
      pk: { userId: user.userEmail },
      subscription: user.subscription,
    });
  }

  sendNotifications(message:any):Observable<any> {
    var baseUri = environment.baseUri_notificationService;
    return this.http.post(`${baseUri}api/TriggerNotifications`, message);
  }
}