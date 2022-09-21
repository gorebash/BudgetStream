import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Budget Stream';

  constructor(private sw:SwPush) { }

  requestNotificationPermissions() {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
          console.log("The user accepted");
      }
    });
  }

  async subscribe () {
    try {
      const sub = await this.sw.requestSubscription({
        serverPublicKey: environment.PUBLIC_VAPID_KEY,
      });

      // TODO: Send to server.
      
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
  }

  async subscribeNotificationHandlers (){
    this.sw.notificationClicks.subscribe(
      ({action, notification}) => {
          // TODO: Do something in response to notification click.
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
