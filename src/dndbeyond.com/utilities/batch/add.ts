import logger from "../../../utilities/logging/index";
import load from "./load";
import save from "./save";

const add = async (pages: string[]): Promise<BatchStep> => {
  let batch = await load();

  pages = pages.reverse();

  logger.debug("Adding pages to batch", pages);
  logger.debug("Batch pre-add", batch.pages);
  pages.forEach((page) => {
    if (!batch.pages.includes(page)) {
      batch.pages = [page, ...batch.pages];
    }
  });

  await save(batch);
  logger.debug("Batch post-add", batch.pages);

  return {
    batchId: batch.batchId,
    status: batch.status,
    url: batch.pages.length !== 0 ? batch.pages[0] : null,
  };
};

export default add;
