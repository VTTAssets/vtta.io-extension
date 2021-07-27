import CONFIG from "../../../../config/index";
import logger from "../../../../utilities/logging/index";

import Storage from "../../../../utilities/storage/index";
import { ping } from "../relayed/onPing";

/**
 * MessageHandler onAction
 * Is triggered when the popup is displayed by clicking the browser action
 *
 * This will check if the Foundry connection is already established. If not, it will
 * try to see if the currently active tab is probably a Foundry tab based on the tab's title
 * If that evaluates to true, it will inject the content script to initiate the Foundry connection
 */

/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.ACTION;

/**
 * Checks if the currently active tab is a FVTT tab, given it's title
 * @returns {null|chrome.tabs.Tab} The chrome tab, if it's probably the FVTT tab, or null
 */
const isFoundryTabActive = async (): Promise<null | chrome.tabs.Tab> => {
  return new Promise((resolve) => {
    try {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (
          tabs &&
          tabs.length &&
          tabs[0].title &&
          tabs[0].title ===
            "Foundry Virtual Tabletop • A Standalone Virtual Tabletop Application"
        ) {
          resolve(tabs[0]);
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

/**
 * MessageHandler onAction
 * Is triggered when the popup is displayed by clicking the browser action
 *
 * This will check if the Foundry connection is already established. If not, it will
 * try to see if the currently active tab is probably a Foundry tab based on the tab's title
 * If that evaluates to true, it will inject the content script to initiate the Foundry connection
 * @param data none
 * @returns
 */
const handler: MessageHandler = async (
  data: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  logger.info("Handler onAction starting...");

  let response: MessageHandlerResponse = {
    success: false,
    data: {
      message: "Handler initiated",
    },
  };

  // 1. is Alive? We can directly call the ping method from the background script
  const fvttConnection = await ping();
  logger.info("Ping result", fvttConnection);

  if (fvttConnection.success) {
    response = fvttConnection;
    logger.info("Foundry is already connected", fvttConnection);
    return callback(fvttConnection);
  } else {
    logger.info("No heartbeat from Foundry received");
    // we signal the connection attempt to the popup early, so it will get subsequent updates from the succes
    // or failure of the connection attempt, too

    // 2. Is the currently displayed tab a Foundry tab?
    const tab = await isFoundryTabActive();
    if (tab) {
      callback({
        success: false,
        data: {
          message: "Connection initiated",
        },
      });
      console.log("Foundry is active Tab");
      // inject the content script
      const injection = {
        target: { tabId: tab.id, allFrames: true },
        files: ["content/fvtt/index.js"],
      };
      const injectionResult = await chrome.scripting.executeScript(injection);
      logger.info("Injection Result", injectionResult);

      // this is a true disconnected communication from here on. We will report back a pending state
      // the success of the connection is transmitted from the content script itself
      // and all interested parties need to register a listener to that event themselves
    } else {
      logger.info("Foundry is not the active tab");
      return callback({
        success: false,
        data: {
          message: "ActiveTab not Foundry VTT",
        },
      });
    }
  }
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
