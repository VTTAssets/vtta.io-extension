import logger from "../../../../utilities/logging/index";
import CONFIG from "../../../../config/index";
import Storage from "../../../../utilities/storage/index";
import { API } from "../../../../utilities/api/index";

/**
 * Message type
 */
export const MESSAGE_TYPE = CONFIG.messages.EXTERNAL_PROFILE_CONNECT;

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
  logger.info("COnnection attempt with the following data", data);
  // Is there a token supplied, so we can query the
  const token = data?.data?.token;
  if (!token) {
    let response: MessageHandlerResponse = {
      success: false,
      data: "No token supplied",
    };
    return callback(response);
  }

  // Check which environment to use based on the connecting sender
  let environment: string;
  switch (sender.origin) {
    case "https://www.vtta.io":
      environment = "PRODUCTION";
      break;
    case "https://www.vtta.dev":
      environment = "STAGING";
      break;
    default:
      environment = "LOCAL";
  }

  const config = CONFIG.environments.find(
    (config) => config.name === environment
  );

  // Set the storage entries to reflect the probable change in environment
  // this will trigger a refresh of the user's profile
  logger.info("[ENVIRONMENT] Setting environment " + config.label);

  await Storage.sync.set({
    environment: config.name,
    user: {
      token: token,
    },
  });

  // instantiate the API
  const api = await API();

  // get the user profile
  const profile = <User>await api.get("/auth/profile");

  logger.info("Retrieved user from API", profile);

  // update the storage again
  logger.info("Updating the user within the storage", { user: profile });
  await Storage.sync.set({ user: profile });

  const manifest = chrome.runtime.getManifest();

  let response: MessageHandlerResponse = {
    success: true,
    data: {
      version: manifest.version,
    },
  };

  return callback(response);
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
