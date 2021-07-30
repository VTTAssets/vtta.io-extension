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
import batch from "../utilities/batch/index";

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
            `<b>Up-to-date entities</b>: ${processedCount}, <b>Outdated or missing entities</b>: ${
              entities.length - processedCount
            }`,
            "note"
          );
        }

        // filter all items without data out
        entities = entities.filter((entity) => entity.data !== null);

        if (entities.length) {
        }

        const parsedCounter = status.counter.create("Parsed", entities.length);

        // parse everything
        let promises = await Promise.allSettled(
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

        let successes: any[] = [];
        const failures: string[] = [];
        promises.forEach((promise, index) => {
          if (promise.status === "fulfilled") {
            successes = successes.concat(promise.value);
          } else {
            failures.push(`/${entities[index].slug}`);
          }
        });

        const importLabel = status.add(
          "Importing parsed entities. The FVTT tab will display detailed progress information.",
          "pending"
        );

        const importResult = await Tools.entity.import(successes);
        logger.info("Import Result", importResult);
        if (importResult !== true) {
          status.add("Error importing the parsed entities!", "error");
        } else {
          status.edit(
            importLabel.id,
            "Successfully imported " + successes.length + " entities.",
            "success"
          );
        }

        // Update the batch with all processed URLs
        const processedUrls = [step.url].concat(
          successes.map((entity) => `/${entity.flags.vtta.id}`)
        );

        logger.info("Processed the following URLs", processedUrls);

        if (failures.length) {
          status.add(
            `Failed to parse the following entities: ${failures.join(
              ", "
            )}. I will try to parse it after finishing this list individually.`,
            "error"
          );

          await batch.add(failures.map((failure) => `/${failure}`));
          await status.timer("Continuing batch in 10 secnds", 10, {
            abortable: false,
          });
        }

        const batchData: BatchUpdate = {
          status: "OK",
          next: page.info.next,
          processed: processedUrls,
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
        if (page.env.batch.status === "DONE") {
          let status = StatusDisplay();
          status.clear();
          status.add(
            "<p><strong>Done!</strong></p><p>Everything is imported and ready to use. Have fun! </p>",
            "success"
          );
          status.complete(true);
        }

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
