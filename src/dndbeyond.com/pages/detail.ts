import logger from "../../utilities/logging/index";
import Batch from "../utilities/batch/index";
import Page from "../utilities/page/index";

import Tools from "../utilities/parsing/index";
import { StatusDisplay } from "../../utilities/ui/status";

import getDetailItem from "../utilities/detail/getDetailItem";
import Block from "../utilities/block/detailBlock";

const main = async () => {
  const page = await Page.initialize("DETAIL");
  if (!page) return;

  // Manual or automatic processing of entities
  switch (page.env.processingMode) {
    case "PROCESSING_MODE_AUTOMATIC":
      {
        const step = page.env.batch;
        logger.info("Processing Mode: AUTO");
        let itemData = await getDetailItem();

        let status = StatusDisplay();
        const statusCounter = status.counter.create("Processed", 1);

        // Set up-to-date and unlicensed content as done
        let processedCount = itemData.status === "NOOP" ? 1 : 0;
        if (processedCount > 0) {
          status.add(
            "Entity does not require an update: " + processedCount,
            "success"
          );
          status.counter.update(statusCounter, processedCount);
        }

        if (itemData.data !== null) {
          const entity = await Tools.entity.parse(
            itemData.slug,
            itemData.name,
            { img: itemData.img },
            itemData.data
          );

          const importResult = await Tools.entity.import(entity);
          if (importResult !== true) {
            status.add("Error importing entity " + itemData.name, "error");
          } else {
            status.add(`Successfully imported ${itemData.name}...`, "success");
          }
          status.counter.update(statusCounter, ++processedCount);

          // Update the batch with all processed URLs
          Batch.update({
            status: "OK",
            next: null,
            processed: [new URL(document.URL).pathname],
          }).then((batchStep) => {
            if (batchStep.url) {
              // DEBUG: DISABLE GOING TO NEXT PAGE
              window.location.href = batchStep.url;
            }
          });
        }
      }
      break;
    case "PROCESSING_MODE_MANUAL":
      {
        // get the details of this node
        let itemData = await getDetailItem();
        const block = Block(page.env, page.info, itemData);
      }
      break;
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
}
