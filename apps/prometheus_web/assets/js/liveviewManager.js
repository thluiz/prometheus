import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

import {
    UpdateSubscriptionEventKey,
    BeginUpdateSubscriptionStateEventKey,
    BeginToggleUpdateSubscriptionEventKey,
    BtnToggleSubscription
} from "./notificationManager"

let SubscriptionActions = {
    UpdateSubscription: "update-subscription"
};

export class LiveviewManager {
    constructor() {
        const updateSubscriptionStateEvent = new Event(BeginUpdateSubscriptionStateEventKey);
        const beginToggleSubscriptionEvent = new Event(BeginToggleUpdateSubscriptionEventKey);

        let Hooks = {}
        Hooks.Subscription = {
            mounted() {
                this.el.addEventListener("click", _ => {
                    BtnToggleSubscription.dispatchEvent(beginToggleSubscriptionEvent);
                });

                this.el.addEventListener(UpdateSubscriptionEventKey, e => {
                    let subscription = e.detail.subscription;

                    this.pushEvent(SubscriptionActions.UpdateSubscription, {
                        subscription: JSON.stringify(subscription),
                        subscribed: !(subscription === null)
                    });
                });

                BtnToggleSubscription.dispatchEvent(updateSubscriptionStateEvent);
            }
        }

        Hooks.StoreSettings = {
            mounted() {
                let currentkey = localStorage.getItem("userkey");

                if (!currentkey) {
                    currentkey = generateKey();
                    localStorage.setItem("userkey", currentkey);
                }

                this.pushEvent("restore-settings", {
                    userkey: currentkey,
                });
            }
        }

        let liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks, params: { _csrf_token: csrfToken } })

        // connect if there are any LiveViews on the page
        liveSocket.connect()

        // expose liveSocket on window for web console debug logs and latency simulation:
        // >> 
        liveSocket.enableDebug()
        // >> liveSocket.enableLatencySim(1000)

        //Backward compatibility
        window.liveSocket = liveSocket;
    }
}

function generateKey() {
    return uuidv4();
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}