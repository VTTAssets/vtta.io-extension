import logger from "../../../utilities/logging/index";
import Batch from "../../utilities/batch/index";
import Page from "../../utilities/page/index";

import Status from "../../../utilities/ui/status";

const main = async () => {
  const page = await Page.initialize("MARKETPLACE");
  if (!page) return;

  logger.info("D&D Integration: Marketplace module loaded...");

  const step = await Batch.get();

  if (page.env.batch.status === "RUNNING") {
    // check if we are trying to extract something from an adventure that is unlicensed

    if (page.env.batch.url.indexOf("/sources/") === 0) {
      let status = Status("Batch import stopped");
      status.add(
        `<p class='note'>Access to <a href="https://www.dndbeyond.com${page.env.batch.url}">${page.env.batch.url}</a> seems not to be possible for you, aborting batch.</p>`,
        "error"
      );

      // redirecting to the entrypoing of this batch
      const batchInfo = await Batch.load();
      await Batch.stop();
      await status.timer("Redirecting to " + batchInfo.start, 10);
      document.location.href = batchInfo.start;
    } else {
      // It's "just" a monster that is inaccessible, we try to continue the batch without it
      let status = Status("Batch import running");
      status.add(
        `<p class='note'>Access to <a href="https://www.dndbeyond.com${page.env.batch.url}">${page.env.batch.url}</a> seems not to be possible for you. I will continue with the next page in the batch.</p>`,
        "error"
      );
      await status.timer("Continuing in 5 seconds...", 5, { abortable: true });
      const step = await Batch.update({
        status: "OK",
        processed: page.env.batch.url,
        next: null,
      });
      window.location.href = step.url;
    }
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
}
