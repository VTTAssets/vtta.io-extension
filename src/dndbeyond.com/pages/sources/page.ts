import logger from "../../../utilities/logging/index";
import Page from "../../utilities/page/index";
import Batch from "../../utilities/batch/index";
import Status from "../../../utilities/ui/status";
import { Parser } from "../../../utilities/api/index";

const getNextURL = () => {
  const element = $(".top-next-page a");
  if (element.length) {
    const href = $(element).attr("href");
    if (!href) return null;

    const url = new URL(href, document.URL);
    return url.pathname;
  }
  return null;
};

const main = async () => {
  const page = await Page.initialize("PAGE");
  if (!page) return;

  logger.debug("Page Information", page);
  let matches = document.URL.match(
    /^https:\/\/www\.dndbeyond\.com\/sources\/(\w+)\/(.+)$/
  );
  if (!matches) {
    return;
  }
  const code = page.info.entityName;
  const slug = `sources/${code}`;

  logger.info("D&D Integration: Sources (Page) module loaded...");

  if (
    page.env.batch.status === "RUNNING" &&
    document.URL === `https://www.dndbeyond.com${page.env.batch.url}` &&
    page.env.batch.batchId
  ) {
    let status = Status("Batch import running");
    status.add(
      `<p class='note'>The importer will automatically load all relevant pages and process the information found. <b>For best results</b>, bring both the Foundry VTT tab <b>and</b> this D&amp;D Beyond browser tab into the foreground, placing them next to each other.</p>`,
      "success"
    );

    // this sourcebook page is now due for processing
    const parser = await Parser(slug);

    // send over the page contents
    const html = $(".p-article-content").getHtml();
    const result = <Batch>await parser.post(
      "sources/batch/" + page.env.batch.batchId,
      {
        code: code,
        url: page.env.batch.url,
        html: html,
      }
    );

    if (result) {
      const batchStep = await Batch.update({
        status: "OK",
        processed: new URL(document.URL).pathname,
        next: getNextURL(),
      });

      // add an anti-bot-detection delay
      await status.delay();

      // continue
      if (batchStep.url) {
        window.location.href = batchStep.url;
      }
    }
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
}
