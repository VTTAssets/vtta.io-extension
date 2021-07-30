import logger from "../../../../utilities/logging/index";
import CONFIG from "../../../../config/index";
import Storage from "../../../../utilities/storage/index";
import { API } from "../../../../utilities/api/index";

import { relay } from "./index";

/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.FVTT_PING;

export const ping = async (): Promise<MessageHandlerResponse> => {
  try {
    logger.debug("Pinging FVTT...");
    const t0 = performance.now();
    const response = await relay({
      type: CONFIG.messages.FVTT_PING,
    });
    const duration = performance.now() - t0;
    logger.debug("PING response: ", response);
    if (response.success) {
      logger.info("[PING: Success] Foundry is available");
      return {
        success: true,
        data: {
          duration: duration,
        },
      };
    } else {
      return {
        success: false,
        data: {
          duration: -1,
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      data: {
        duration: -1,
      },
    };
  }
};

/**
 * MessageHandler onAction
 * Is triggered when the popup is displayed by clicking the browser action
 * @param data none
 * @returns
 */
const handler: MessageHandler = async (
  data: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  logger.debug("Relaying " + MESSAGE_TYPE, data);
  // Is there a token supplied, so we can query the

  try {
    const result = await ping();
    logger.debug("Ping result", result);
    if (result) {
      return callback(result);
    }
  } catch (error) {
    return callback({
      success: false,
      data: {
        message: error.message,
      },
    });
  }
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
