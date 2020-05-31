const applicationServerPublicKey =
    "BDw-T4EoW6fR1Re-oSIF4hprfRdSdtITsGBCjM46toRs_x16uB4EdJppZAoXBogBAM0guT5Fdsie9HERCTTqqcg";

const pushButton = document.querySelector(".js-push-btn");

function initializeUI() {
    pushButton.addEventListener("click", function() {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager
        .getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                console.log("User IS subscribed.");
            } else {
                console.log("User is NOT subscribed.");
            }

            updateBtn();
        });
}

function updateBtn() {
    if (isSubscribed) {
        pushButton.textContent = "Disable Push Messaging";
    } else {
        pushButton.textContent = "Enable Push Messaging";
    }

    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(
        applicationServerPublicKey
    );
    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
        })
        .then(function(subscription) {
            console.log("User is subscribed.");

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log("Failed to subscribe the user: ", err);
            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager
        .getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log("Error unsubscribing", error);
        })
        .then(function() {
            updateSubscriptionOnServer(null);

            console.log("User is unsubscribed.");
            isSubscribed = false;

            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {
    console.log(JSON.stringify(subscription));
}

function urlB64ToUint8Array(base64String) {
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