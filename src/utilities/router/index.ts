import logger from "../logging/index";
/**
 * Registering all possible Messages
 */
export default (
  source: string,
  type: "ROUTER" | "RELAY",
  messageHandlers: MessageHandlerDefinition[],
  defaultHandler?: MessageHandlerDefinition
) => {
  return (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: MessageCallback
  ) => {
    logger.info(`[${type}:${source}] Message received`, message);

    const messageType = message.type;

    // Find a specific handler for this type of message
    const messageHandler = messageHandlers.find(
      (messageHandler) => messageHandler.type === messageType
    );

    if (messageHandler) {
      logger.info(
        `[ROUTER:${source}] Handler ${messageHandler.type}: Calling...`
      );
      // Found a registered message handler for this type of message
      return messageHandler.handler(message, sender, sendResponse);
    } else {
      if (defaultHandler) {
        logger.info(`[${type}:${source}] Calling default handler...`, message);
        return defaultHandler.handler(message, sender, sendResponse);
      }
    }
    return true;
  };
};
