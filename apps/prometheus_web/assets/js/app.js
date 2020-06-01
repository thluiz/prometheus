// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"

import { ServiceWorkerManager } from "./serviceWorkerManager"
import { NotificationManager } from "./notificationManager"
import { LiveviewManager } from "./liveviewManager"

import NProgress from "nprogress"
// Show progress bar on live navigation and form submits
window.addEventListener("phx:page-loading-start", info => NProgress.start())
window.addEventListener("phx:page-loading-stop", info => NProgress.done())

let liveviewManager = new LiveviewManager();
window.liveviewManager = liveviewManager;

new ServiceWorkerManager((swReg) => {        
    new NotificationManager(swReg);
});