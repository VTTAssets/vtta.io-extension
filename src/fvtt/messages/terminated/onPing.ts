import CONFIG from "../../../config/index";
/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.FVTT_PING;

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
  let response: MessageHandlerResponse = {
    success: true,
    data: CONFIG.messages.FVTT_PONG,
  };

  // retrieve the Foundry and dnd5e system version

  if (callback) callback(response);

  // returning the response back to the router for logging
  return Promise.resolve(response);
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
