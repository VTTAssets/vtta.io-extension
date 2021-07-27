import Status from "../../../utilities/ui/status";
import Batch from "../../utilities/batch/index";

export default () => {
  // Add the button that starts the import to the page header
  $(".page-heading__content").addClass("vtta");
  const button = $(
    `<div class="vtta basic-button"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png"> <a href="https://www.dndbeyond.com/sources/basic-rules">Start Import</a></div>`
  );
  $(".page-heading__content").append(button);

  // Build the batch info by looking at the document.URL and start the batch by a reload
  $(button).on("click", async (event) => {
    event.preventDefault();

    let status = Status("Batch import running");
    status.add(
      "<p class='note'>Pages will refresh automatically. For best results, bring the Foundry VTT tab into the foreground.</p>",
      "success"
    );

    const url = new URL(document.URL);
    const step = await Batch.start({
      batchId: "0",
      code: "custom",
      id: 0,
      name: "custom",
      pages: [url.href.replace(url.origin, "")],
      start: url.href.replace(url.origin, ""),
      character: 0,
      status: "RUNNING",
    });

    if (step.url) {
      window.location.href = step.url;
    }
  });
};
