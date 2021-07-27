import save from "./save";

/**
 * Starts the batch process by adding the metadata and setting a list of URLs to process
 * in order
 * @param data Batch data to process in this batch
 * @returns string The first URL to process
 */
const start = async (data: Batch): Promise<BatchStep> => {
  if (data.pages.length === 0) {
    return {
      status: "STOPPED",
      url: null,
    };
  }

  // set the status to RUNNING
  data.status = data.status || "RUNNING";

  try {
    await save(data);
    return {
      status: data.status,
      url: data.pages[0],
    };
  } catch (error) {
    throw error;
  }
};

export default start;
