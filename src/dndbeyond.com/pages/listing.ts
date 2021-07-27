import logger from "../../utilities/logging/index";
import Batch from "../utilities/batch/index";
import Page from "../utilities/page/index";
import Tools from "../utilities/parsing/index";
import { StatusDisplay } from "../../utilities/ui/status";

import {
  getListItems,
  getListObserver,
  isListingStart,
  processListStart,
} from "../utilities/list";

const main = async () => {
  const page = await Page.initialize("LISTING");
  if (!page) return;

  logger.info("Page Information", page);

  // Manual or automatic processing of entities
  switch (page.env.processingMode) {
    case "PROCESSING_MODE_AUTOMATIC":
      {
        const step = page.env.batch;
        logger.info("Processing Mode: AUTO");
        let status = StatusDisplay();
        let entities = await getListItems();

        // Set up-to-date and unlicensed content as done
        let processedCount = entities.filter(
          (entity) => entity.status === "NOOP"
        ).length;
        if (processedCount > 0) {
          status.add(
            "Entities not requiring an update: " + processedCount,
            "note"
          );
        }

        // filter all items without data out
        entities = entities.filter((entity) => entity.data !== null);

        const parsedCounter = status.counter.create("Parsed", entities.length);

        // parse everything
        let parsedEntities = await Promise.all(
          entities.map(async (itemData, index) => {
            const entity = await Tools.entity.parse(
              itemData.slug,
              itemData.name,
              { img: itemData.img },
              itemData.data
            );
            status.counter.update(parsedCounter, null);
            return entity;
          })
        );
        parsedEntities = parsedEntities.flat(1);

        const importLabel = status.add(
          "Importing parsed entities. The FVTT tab will display detailed progress information.",
          "pending"
        );

        const importResult = await Tools.entity.import(parsedEntities);
        logger.info("Import Result", importResult);
        if (importResult !== true) {
          status.add("Error importing the parsed entities!", "error");
        } else {
          status.edit(
            importLabel.id,
            "Successfully imported " + parsedEntities.length + " entities.",
            "success"
          );
        }

        // const importedEntities = await Promise.all(
        //   parsedEntities.map(async (entity, index) => {
        //     const importResult = await Tools.entity.import(entity);
        //     if (importResult !== true) {
        //       status.add("Error importing entity " + entity.name, "error");
        //     }
        //     status.counter.update(importCounter, index + 1);
        //   })
        // );

        // // parse and import everything
        // const processedEntities = await Promise.all(
        //   entities.map(async (itemData, index) => {
        //     const entity = await Tools.entity.parse(
        //       itemData.slug,
        //       itemData.name,
        //       { img: itemData.img },
        //       itemData.data
        //     );

        //     const importResult = await Tools.entity.import(entity);
        //     status.counter.update(statusCounter, ++processedCount);
        //     if (importResult !== true) {
        //       status.add("Error importing entity " + itemData.name, "error");
        //       return { success: false, name: itemData.name };
        //     } else {
        //       status.add(
        //         `Successfully imported ${itemData.name}...`,
        //         "success"
        //       );
        //       return {
        //         success: true,
        //         name: itemData.name,
        //         url: `/${itemData.slug}`,
        //       };
        //     }
        //   })
        // );

        // Update the batch with all processed URLs

        /**
         * I need to change this
         */
        // let processedUrls = [step.url].concat(
        //   processedEntities.map((item) => item.url)
        // );

        // logger.info("Processed the following URLs", processedUrls);

        const batchData: BatchUpdate = {
          status: "OK",
          next: page.info.next,
          processed: [step.url], // processedUrls,
        };

        logger.info("Updating Batch", batchData);

        const batchStep = await Batch.update(batchData);
        logger.info("Response from Batch Update", batchStep);
        if (batchStep.url) {
          // DEBUG: DISABLE GOING TO NEXT PAGE
          window.location.href = batchStep.url;
        }
      }
      break;
    case "PROCESSING_MODE_MANUAL":
      {
        logger.info("Processing Mode: MANUAL");
        // observe the list for changes in the UI
        const observer = getListObserver(page.env);
        observer.subscribe((itemData: ItemData) => {
          logger.info("Observer starts processing new block", itemData);
        });

        // Add the ability to start a batch when it's the list start
        if (isListingStart()) {
          // Add the button that starts the import to the page header
          processListStart();
        }
      }
      break;
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
}
