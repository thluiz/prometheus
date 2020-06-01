
const applicationServerPublicKey = "BDw-T4EoW6fR1Re-oSIF4hprfRdSdtITsGBCjM46toRs_x16uB4EdJppZAoXBogBAM0guT5Fdsie9HERCTTqqcg";

export const BeginUpdateSubscriptionStateEventKey = "begin-update-subscription-state"
export const BeginToggleUpdateSubscriptionEventKey = "begin-toggle-update-subscription"
export const UpdateSubscriptionEventKey = "update-subscription"

export const BtnToggleSubscription = document.getElementById("toggle-subscription");

export class NotificationManager {    
    constructor(serviceWorker) {        
        this._serviceWorker = serviceWorker;  
          
        BtnToggleSubscription.addEventListener(BeginToggleUpdateSubscriptionEventKey, () => {
            this._ToggleSubscription(serviceWorker);
        }, false);

        BtnToggleSubscription.addEventListener(BeginUpdateSubscriptionStateEventKey, () => {
            this._UpdateSubscriptionStatus(serviceWorker);
        }, false);
    }

    _ToggleSubscription(serviceWorker) {
        serviceWorker.pushManager
            .getSubscription()
            .then((subscription) => {
                let isSubscribed = !(subscription === null);

                if (!isSubscribed) {
                    console.log("Subscribing User...");
                    this._subscribeUser(serviceWorker);
                } else {
                    console.log("UNsubscribing User...");
                    this._unsubscribeUser(serviceWorker);
                }
            });
    }

    _subscribeUser(serviceWorker) {
        const applicationServerKey = this._urlB64ToUint8Array(
            applicationServerPublicKey
        );
        serviceWorker.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey,
            })
            .then(() => {
                console.log("User subscribed!!");
                this._UpdateSubscriptionStatus(serviceWorker);
            })
            .catch(function (err) {
                console.log("Failed to subscribe the user: ", err);
            });
    }

    _unsubscribeUser(serviceWorker) {
        serviceWorker.pushManager
            .getSubscription()
            .then(function (subscription) {
                if (subscription) {                    
                    return subscription.unsubscribe(serviceWorker);
                }
            })
            .catch((error) => {
                console.log("Error unsubscribing", error);
            })
            .then(() => {
                console.log("User UNsubscribed!!");                
                this._UpdateSubscriptionStatus(serviceWorker);
            });        
    }

    _UpdateSubscriptionStatus(serviceWorker) {
        serviceWorker.pushManager
            .getSubscription()
            .then((subscription) => {                
                var event = new CustomEvent(UpdateSubscriptionEventKey, { detail: { subscription: subscription } });      
                BtnToggleSubscription.dispatchEvent(event);
            });

    }

    _urlB64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}






