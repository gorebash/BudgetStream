import { Component, ElementRef, ViewChild } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { SubscriptionService } from './services/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Budget Stream';
  @ViewChild('notificationBody') notificationBody!: ElementRef;

  constructor(private sub:SubscriptionService, private sw:SwPush) { }

  requestNotificationPermissions() {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
          console.log("The user accepted");
      }
    });
  }

  async subscribe () {
    try {
      const subscription = await this.sw.requestSubscription({
        serverPublicKey: environment.PUBLIC_VAPID_KEY,
      });

      this.sub.addPushSubscriber(subscription)
        .subscribe(() => {
          console.log("push subscription created.");
        });
    

    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
  }

  sendNotifications () {
    var message = this.notificationBody.nativeElement.value;
    this.sub.sendNotifications(message)
      .subscribe(() => {
        console.log("notifications sent.");
      });
  }

  async subscribeNotificationHandlers (){
    this.sw.notificationClicks.subscribe(
      ({action, notification}) => {
          console.log("found notification!");
          console.log(action);
          console.log(notification);
      });

    this.sw.messages.subscribe((message) => {
      console.log("message received!");
      console.log(message);
    });
  }
}
