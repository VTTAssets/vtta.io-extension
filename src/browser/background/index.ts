import logger from "../../utilities/logging/index";
import MessageRouter from "./messages/index";

logger.debug("[ServiceWorker] Initializing...");

chrome.runtime.onMessage.addListener(MessageRouter.relay);
chrome.runtime.onMessage.addListener(MessageRouter.router);
chrome.runtime.onMessageExternal.addListener(MessageRouter.external);
