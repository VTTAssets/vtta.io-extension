import logger from "../../../../utilities/logging/index";
import CONFIG from "../../../../config/index";
import Storage from "../../../../utilities/storage/index";
import { API } from "../../../../utilities/api/index";

import { relay } from "./index";

/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.FVTT_MESSAGE;

/**
 * MessageHandler default
 * For all relayed messages that are not specificially handled, they just get relayed to an active FVTT tab
 * and the response is directly called back without any more additional logic
 * @param data none
 * @returns
 */
const handler: MessageHandler = async (
  data: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  logger.info("Relay Start: " + MESSAGE_TYPE, data);
  // Is there a token supplied, so we can query the
  const response = await relay(data);
  logger.info("Relay ENd: ", response);
  return callback(response);
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
