import CONFIG from "../../../config/index";
import uuid from "../../../utilities/uuid/index";
import logger from "../../../utilities/logging/index";

/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.FVTT_MESSAGE;

/**
 * The Foundry message handler is a relay in itself. It wraps the received messages from the extension into
 * CustomEvent messages passed to the vtta-ddb module, waits for responses and relays those back
 */

// All messages currently waiting for a reply
let stack: StackEntry[] = [];

/**
 * MessageHandler onAction
 * Is triggered when the popup is displayed by clicking the browser action
 * @param data none
 * @returns
 */
const handler: MessageHandler = (
  data: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  const MESSAGE_ID = uuid();
  stack.push({
    id: MESSAGE_ID,
    callback: callback,
  });

  const eventHandler = (event: CustomEvent) => {
    // get the message info from our stack
    logger.info("Received reply " + MESSAGE_ID, event);
    const handler = stack.find((handler) => handler.id === event.type);

    if (handler) {
      // call the handler and remove that listener from the stack
      logger.info("Callback found, relaying reply...");
      handler.callback(event.detail);
      stack = stack.filter((handler) => handler.id !== MESSAGE_ID);
      window.removeEventListener(handler.id, eventHandler);
    }
  };

  logger.info("Creating Custom Event Listener: " + MESSAGE_ID);
  // registering
  window.addEventListener(MESSAGE_ID, eventHandler);

  /**
   * If we haven't received a response with two seconds, we will clean up this message
   */
  // setTimeout((id: string) => {
  //   const handler = stack.find((handler) => handler.id === id);
  //   if (handler) {
  //     // cancel the event
  //     window.removeEventListener(id, eventHandler);
  //     logger.warn("No response from vtta-ddb for message", data);
  //     callback({
  //       data: {
  //         reason: "No response within 2s from Foundry",
  //       },
  //       success: false,
  //     });
  //   }
  // }, 2000);

  logger.info(
    "Dispatching Custom Event " + CONFIG.messages.FVTT_CUSTOMEVENT_TAG
  );
  window.dispatchEvent(
    new CustomEvent(CONFIG.messages.FVTT_CUSTOMEVENT_TAG, {
      detail: Object.assign(data, { id: MESSAGE_ID }),
    })
  );

  return true;
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
