import CONFIG from "../../../config/index";
import Storage from "Utilities/storage/index";
import Batch from "../batch/index";

const ping = (): Promise<MessageHandlerResponse> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: CONFIG.messages.FVTT_PING },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve({
            success: false,
            data: { message: chrome.runtime.lastError },
          });
        } else {
          resolve(response);
        }
      }
    );
  });
};

const getEnvironment = async (): Promise<Environment> => {
  let isFoundryConnected = false;
  try {
    const result = await ping();
    isFoundryConnected = result.success;
  } catch (error) {
    // this is an expected runtime error since there was no answer. We will not handle that here, because who cares?
  }

  const user = await Storage.sync.get(["user"]);
  const step = await Batch.get();

  return {
    isFoundryConnected,
    user,
    batch: step,
    processingMode:
      step.status === "RUNNING" &&
      document.URL === `https://www.dndbeyond.com${step.url}`
        ? "PROCESSING_MODE_AUTOMATIC"
        : "PROCESSING_MODE_MANUAL",
  };
};

export default getEnvironment;
