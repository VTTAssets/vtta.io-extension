import Storage from "../../../../utilities/storage/index";

export const relay = (message: Message): Promise<MessageHandlerResponse> => {
  return new Promise(async (resolve, reject) => {
    const { target } = await Storage.local.get(["target"]);

    if (target) {
      // The message is already wrapped
      chrome.tabs.sendMessage(target, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } else {
      resolve({
        success: false,
        data: {
          message: "FVTT not connected",
        },
      });
    }
  });
};
