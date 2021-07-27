import load from "./load";
import save from "./save";

const update = async (update: BatchUpdate): Promise<BatchStep> => {
  if (update.status === "OK") {
    try {
      // check if the first batch URL is the one flagged as processed
      let batch = await load();

      if (Array.isArray(update.processed)) {
        batch.pages = batch.pages.filter(
          (url) => !update.processed.includes(url)
        );
      } else {
        batch.pages = batch.pages.filter((url) => url !== update.processed);
      }

      // if the current batch step adds a page onto the stack, process it next
      if (update.next) {
        batch.pages = [update.next].concat(batch.pages);
      }

      // Get the next URL, or if null: We are done with the batch
      const nextUrl = batch.pages.length !== 0 ? batch.pages[0] : null;

      if (nextUrl !== null) {
        await save(batch);
        return {
          url: nextUrl,
          status: batch.status, // "RUNNING",
        };
      } else {
        batch.status = "DONE";
        await save(batch);
        // redirect to the start of the action
        return {
          batchId: batch.batchId,
          url: batch.start,
          status: "DONE",
        };
      }
    } catch (error) {
      throw error;
    }
  }
};

export default update;
