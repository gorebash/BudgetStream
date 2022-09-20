
// Scripts to enable basic POC behavior for the PWA.
// TODO: Refactor this client code into a SWA.

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' });
  }


  // Badges for later
  if (navigator.setAppBadge) {
      console.log("The App Badging API is supported!");
      navigator.setAppBadge(1);
  }


  // Grant permissions for notifications
  if ("Notification" in window) {

      document.getElementById("nofityPermissions").addEventListener("click", () => {
          Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                  console.log("The user accepted");
              }
          });
      });

      //check the status again later..
      if (Notification.permission === "granted") {
          console.log("The user already accepted");
      }

  }


  document.getElementById("nofitySubscribe").addEventListener("click", subscribeForPush);
  // Subscription to push service
  async function subscribeForPush() {
      const registration = await navigator.serviceWorker.ready;

      const vapidPublicKey = "BAbMJGRwLHHc76NTvulB-1di3wjxqqLEOgYyz1_DwsfvQQXC57Tp-f_R_qmY-QaF0n7c4tBnX2eyrKwy2ieUBsg";
      const pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true, // Should be always true as currently browsers only support explicitly visible notifications
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send push subscription to our server to persist it
      saveSubscription(pushSubscription);
  }

  // Utility function for browser interoperability
  function urlBase64ToUint8Array(base64String) {
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');

      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);

      for (var i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }

function publishSubscription(subscription, remove) {
	return fetch('./api/' + (remove ? 'un' : '') + 'subscribe', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription
        })
    });
}

function saveSubscription(subscription) {
    return publishSubscription(subscription);
}

function deleteSubscription(subscription) {
    return publishSubscription(subscription, true);
}

function getPublicKey() {
    return fetch('./api/key')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return urlB64ToUint8Array(data.key);
        });
}