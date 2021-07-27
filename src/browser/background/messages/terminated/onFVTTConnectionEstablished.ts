import CONFIG from "../../../../config/index";
import logger from "../../../../utilities/logging/index";
import Storage from "../../../../utilities/storage/index";

export const MESSAGE_TYPE = CONFIG.messages.FVTT_CONNECTION_ESTABLISHED;

/**
 * MessageHandler onFVTTConnectionEstablished
 * Is triggered when the connection to Foundry VTT has been established
 */
const handler: MessageHandler = async (
  message: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  logger.info("Foundry connection established", message);

  // let's store the FVTT tab in the local storage
  Storage.local.set({ target: sender.tab.id });

  // send the connection status back to the vtta-ddb module

  const { user, environment } = await Storage.sync.get(["user", "environment"]);
  const manifest = chrome.runtime.getManifest();
  const eventData = {
    extension: {
      name: manifest.name,
      version: manifest.version,
      environment: environment,
    },
    user: user,
  };
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
