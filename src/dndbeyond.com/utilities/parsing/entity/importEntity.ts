const importEntity = (entities: any[]): Promise<boolean> => {
  return new Promise((resolve) => {
    // sending the import to FVTT
    const message = {
      type: "FVTT_MESSAGE",
      data: {
        type: "ADD",
        // the entity contains the slug as the id within the entity's flags
        data: entities,
      },
    };

    chrome.runtime.sendMessage(message, (response) => {
      console.log("------------------------------------------------");
      console.log("Response from import");
      console.log(response);
      console.log("------------------------------------------------");

      resolve(response && response.success);
    });
  });
};

export default importEntity;
