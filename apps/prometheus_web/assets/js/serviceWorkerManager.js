function _ServiceWorkerExists() {
    return ("serviceWorker" in navigator)
}

export class ServiceWorkerManager {
    get ServiceWorkerExists() { return _ServiceWorkerExists() }

    constructor(onRegisterCallBack) {
        if (!_ServiceWorkerExists()) {
            if (onRegisterCallBack) {
                onRegisterCallBack();
            }
            return;
        }

        navigator.serviceWorker
            .register("/sw.js", {
                scope: "./"
            })
            .then(function (swReg) {
                console.log("Service Worker is registered", swReg);

                swReg.pushManager
                    .getSubscription()
                    .then((subscription) => {
                        let isSubscribed = !(subscription === null);

                        if (isSubscribed) {
                            console.log("User IS subscribed on Start.");
                        } else {
                            console.log("User is NOT subscribed on Start.");
                        }

                        if (onRegisterCallBack) {
                            onRegisterCallBack(swReg);
                        }
                    });
            });
    }
}