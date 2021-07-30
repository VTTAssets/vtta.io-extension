import logger from "../../../utilities/logging/index";
import Storage from "../../../utilities/storage/index";
import Batch from "../batch/index";
import Status from "../../../utilities/ui/status";

import getPageInfo from "./getPageInfo";
import getEnvironment from "./getEnvironment";

const initialize = async (pageViewMode: PageViewMode): Promise<null | Page> => {
  const env: Environment = await getEnvironment();
  const pageInfo = getPageInfo();

  // filter out totally unwanted pages
  if (!pageInfo) return;

  const moduleName = `${pageInfo.entityName} (${pageInfo.view})`;
  if (pageInfo.view === pageViewMode) {
    logger.info(
      `[VTTA.io] Module ${pageViewMode}: ${moduleName} loaded and activated.`
    );
  } else {
    return null;
  }

  if (!env.isFoundryConnected) {
    logger.info("Foundry not connected, aborting page analysis");
    return null;
  }

  const step = await Batch.get();
  logger.debug("Batch step", step);
  switch (step.status) {
    case "RUNNING": {
      if (document.URL !== `https://www.dndbeyond.com${step.url}`) {
        logger.warn(
          `[VTTA.io] Batch is running, but this document is not meant to be processed (yet?), skipping processing (you can still manually import items on this page).`
        );
        return null;
      } else {
        logger.debug(
          `[VTTA.io] Module ${moduleName} starts to process the page.`
        );
        return {
          info: pageInfo,
          env: env,
        };
      }
      break;
    }
    case "DONE":
      {
        // let status = Status("Batch import completed");
        // status.add(
        //   "<p class='note'>Batch import completed succesfully and will now shutdown.</p>",
        //   "success"
        // );
        // status.complete(true);
        await Batch.stop();
        return {
          info: pageInfo,
          env: env,
        };
      }
      break;
    default: {
      logger.info(`[VTTA.io] Module ${moduleName} starts to process the page.`);
      return {
        info: pageInfo,
        env: env,
      };
    }
  }
};

export default { initialize };
