import checkModuleAvailability from "./checkModuleAvailability";
import CONFIG from "../config/index";
import logger from "../utilities/logging/index";
import MessageRouter from "./messages/index";

const inject = async () => {
  logger.info("[CS:FOUNDRY] hello");

  chrome.runtime.onMessage.addListener(MessageRouter);

  const moduleAvailabilty = await checkModuleAvailability();

  logger.info("Module Availabilty", moduleAvailabilty);

  if (moduleAvailabilty.success) {
    // signal availability to popup and background script
    chrome.runtime.sendMessage(
      Object.assign(
        {
          type: "FVTT_CONNECTION_ESTABLISHED",
        },
        moduleAvailabilty
      )
    );
  } else {
    chrome.runtime.sendMessage({
      type: "FVTT_CONNECTION_ESTABLISHED",
      data: {
        success: false,
      },
    });
  }
};

inject();
