import CONFIG from "../../../../config/index";

interface Version {
  v: number;
}

const queryFoundry = (queryString: string): Promise<Version> => {
  return new Promise((resolve, reject) => {
    // ask foundry if they know about this monster
    const message = {
      type: CONFIG.messages.FVTT_MESSAGE,
      data: {
        type: "QUERY",
        data: [{ id: queryString }],
      },
    };

    chrome.runtime.sendMessage(message, (response) => {
      console.log("+++++++++++++++ RESPONSE FROM QUERY ++++++++++++++++++ ");
      console.log(response);
      if (response.success) {
        const result = response.data.find(
          (entry: any) => entry.id === queryString
        );
        const version = result && result.v ? { v: result.v } : { v: 0 };
        resolve(version);
      } else {
        resolve({ v: 0 });
      }
    });
  });
};

export default queryFoundry;
