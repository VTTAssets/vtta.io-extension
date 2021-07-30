import logger from "../../../utilities/logging/index";
import Page from "../../utilities/page/index";
import Tools from "../../utilities/parsing/index";
import { StatusDisplay } from "../../../utilities/ui/status";

import {
  getListItems,
  getListObserver,
  isListingStart,
  processListStart,
} from "../../utilities/list";

const main = async () => {
  const page = await Page.initialize("ENCOUNTERBUILDER");
  if (!page) return;

  logger.debug("Page Information", page);

  // Ignore while in batch mode
  if (page.env.processingMode === "PROCESSING_MODE_AUTOMATIC") return;

  logger.debug("Processing Mode: MANUAL");
  // observe the list for changes in the UI
  const observer = getListObserver(page.env);
  observer.subscribe((itemData: ItemData) => {
    logger.debug("Observer starts processing new block", itemData);
  });
};

try {
  main();
} catch (error) {
  logger.error(error);
}
