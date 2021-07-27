import load from "./load";

/**
 * Returns the first page in queue to be processed
 * @returns string | null: The next URL or null, if batch mode failed or is disabled
 */
const get = async (): Promise<BatchStep> => {
  let batch = await load();
  return {
    batchId: batch.batchId,
    status: batch.status,
    url: batch.pages.length !== 0 ? batch.pages[0] : null,
  };
};

export default get;
