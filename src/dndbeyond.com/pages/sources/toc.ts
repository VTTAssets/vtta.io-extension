import logger from "../../../utilities/logging/index";
import Batch from "../../utilities/batch/index";
import Page from "../../utilities/page/index";
import Tools from "../../utilities/parsing/index";
import Status from "../../../utilities/ui/status";
import { Parser } from "../../../utilities/api/index";

interface RuleSource {
  id: number;
  code: string;
  name: string;
  character: number;
  pages?: string[];
  start: string;
}

const main = async () => {
  const page = await Page.initialize("TOC");
  if (!page) return;

  const code = page.info.entityName;
  const slug = `sources/${code}`;

  logger.info("D&D Integration: Sources (ToC) Listing module loaded...");

  if (!page.env.isFoundryConnected) {
    return logger.info("Foundry not connected, aborting page analysis");
  }

  logger.info("Step", page.env.batch);

  // Get the sourcebook parser
  const parser = await Parser(slug);

  switch (page.env.batch.status) {
    case "NONE": {
      // Check if this sourcebook is supported
      //const API = Sources(env.user.token);
      // retrieve the batch info
      let sourceInfo: SourceInfo;
      try {
        // Retrieve the basic info about this sourcebook
        sourceInfo = await parser.get(slug);
      } catch (error) {
        // this sourcebook is not yet supported
        $(".page-header .more-links__links").append(
          `<div class="vtta basic-button error"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png">Not (yet) supported</a></div>`
        );
        return;
      }

      if (sourceInfo.success === false) {
        if (code === "mm") {
        } else {
          $(".page-header .more-links__links").append(
            `<div class="vtta basic-button error"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png">${sourceInfo.message}</a></div>`
          );
        }

        return;
      }

      // let's provide the option to parse this sourcebook
      const batch: Batch = {
        id: sourceInfo.id,
        name: sourceInfo.name,
        character: sourceInfo.character,
        status: null,
        batchId: sourceInfo.batchId,
        code: sourceInfo.code,
        start: sourceInfo.start,
        end: sourceInfo.end,
        pages: sourceInfo.pages,
      };

      /**
       * No Batch is currently running, so we will offer the ability to start one:
       */
      const button = $(
        `<div class="vtta basic-button"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png">Start Import</div>`
      );

      $(".page-header .more-links__links").append(button);
      $(button).on("click", async (event) => {
        event.preventDefault();

        let status = Status(
          `Import of <b>${sourceInfo.name}</b> is about to start`
        );
        console.log(
          "Runtime URL: " +
            chrome.runtime.getURL("assets/img/position-chrome-tabs.gif")
        );
        status.add(
          `<div style="display: flex; flex-direction: row">
            <div style="flex-grow: 1";><p>The importer will automatically load all relevant pages and process the information found.</p>
            <p><b>For best results</b>, bring both the Foundry VTT tab <b>and</b> this D&amp;D Beyond browser tab into the foreground, placing them next to each other.</p>
            <p><b>For aborting a running batch</b> use the "Cancel Batch" button in the extension's popup menu. You will find it at the bottom right.</p></div>
            <div style="flex-shrink: 1"><img src="chrome-extension://jkcgfhmpepgnjkjhgkfbengiopmbbhjj/assets/img/position-chrome-tabs.gif"></div></div>`,
          "note"
        );

        logger.info("Source meta from Sources(API)", batch);

        const entitySlugs = batch.pages
          .map((url: string) => {
            const parts = url.split("/").filter((part) => part.length > 0);
            if (
              parts.length === 2 &&
              (parts[0] === "monsters" ||
                parts[0] === "equipment" ||
                parts[0] === "spells" ||
                parts[0] === "magic-items")
            ) {
              return `${parts[0]}/${parts[1]}`;
            }
            return undefined;
          })
          .filter((slug: string | undefined) => slug !== undefined);

        if (entitySlugs.length > 0) {
          const outdatedCounter = status.counter.create(
            "Outdated / missing entities",
            entitySlugs.length
          );
          const upToDateCounter = status.counter.create(
            "Up-to-date entities",
            entitySlugs.length
          );

          await Promise.all(
            entitySlugs.map(async (slug: string) => {
              // check the update status
              const fvtt = await Tools.query.fvtt(slug);
              if (fvtt.v === 0) {
                status.counter.update(outdatedCounter);
              } else {
                const vtta = await Tools.query.vtta(slug);
                if (vtta.v > fvtt.v) {
                  status.counter.update(outdatedCounter);
                } else {
                  status.counter.update(upToDateCounter);
                  batch.pages = batch.pages.filter(
                    (page: string) => page !== `/${slug}`
                  );
                }
              }
            })
          );
          logger.info(
            "Updated batch by filtering out all up-to-date entities",
            batch
          );
        }

        const data = <Batch>Object.assign(batch, {
          cover: $(".view-cover-art a").attr("href"),
        });

        try {
          await status.timer("Import starting in...", 10, { abortable: true });

          // starting the batch if it wasn't cancelled by the user
          Batch.start(data).then((batchStep: BatchStep) => {
            // start the parse
            window.location.href = batchStep.url;
          });
        } catch (error) {
          if (error === "ABORT") {
            return status.add(
              "Import was cancelled by user request",
              "success"
            );
          }
        }
      });
      break;
    }
    /**
     * We went through the full loop and are having some results to display!
     */
    case "DONE":
      {
        const batchId = page.env.batch.batchId;
        if (!batchId) {
          logger.warn(
            "No Batch ID received upon finishing the batch, what#s wrong?",
            page.env.batch
          );
          return;
        }

        let status = Status("Batch import running");
        status.add(
          `<p class='note'>All required monsters and items were imported successfully, now the actual content import is about to begin.</p>`,
          "note"
        );

        // all monsters, items and such are imported, now let's fetch the collected
        // journal entries and scene information from the API
        // const api = await API(
        //   new URL(document.URL).pathname.substring(1),
        //   env.user.token
        // );
        // const API = Sources(env.user.token);
        let importState = status.add(
          "<p><strong>Retrieving aggregated content...</strong></p>",
          "pending"
        );

        const response = await parser.get(
          "sources/batch/" + page.env.batch.batchId
        );

        logger.info("Aggregated result", response);

        if (!response.success) {
          logger.info("API could not process the result");
          status.edit(
            importState.id,
            "<p><strong>Something went wrong!</strong> The Parser did not deliver your result. I already got a message about the issue and will look at it soon.</p>",
            "error"
          );
          return;
        }

        const aggregatedResult = response.data;
        status.edit(
          importState.id,
          "<p><strong>Received the aggregated result</strong> from the batch, splitting it into entities to send it over to Foundry. <strong>It would be a good time to bring your Foundry tab into the foreground to speed up the process</strong> if you haven't done that already.</p>",
          "success"
        );

        // we have journals, scenes and rolltables in that result. Let's split it up and
        // process it one by one

        /**
         * Journals
         */
        const journals = aggregatedResult.filter(
          (entity: any) => entity.type === "journal"
        );
        if (journals.length) {
          importState = status.add(
            `<p><strong>Importing ${journals.length} Journal Entries...</strong> </p>`,
            "pending"
          );
          const importResult = await Tools.entity.import(journals); //importEntities(journals);
          logger.info("JournalEntries imported", importResult);
          status.edit(
            importState.id,
            `<p><strong>Importing ${journals.length} Journal Entries... Done.</strong>`,
            "success"
          );
        } else {
          status.add(
            `<p><strong>No Journal Entries found in this import, continuing.</strong> </p>`,
            "success"
          );
        }

        /**
         * Scenes
         */
        const scenes = aggregatedResult.filter(
          (entity: any) => entity.type === "scene"
        );
        if (scenes.length) {
          importState = status.add(
            `<p><strong>Importing ${scenes.length} Scenes Entries...</strong> </p>`,
            "pending"
          );

          const importResult = await Tools.entity.import(scenes); //await importEntities(scenes);
          logger.info("Scenes imported", importResult);
          status.edit(
            importState.id,
            `<p><strong>Importing ${scenes.length} Scenes Entries... Done.</strong> </p>`,
            "success"
          );
        } else {
          status.add(
            `<p><strong>No Scenes found in this import, continuing.</strong> </p>`,
            "success"
          );
        }

        /**
         * Tables
         */
        const tables = aggregatedResult.filter(
          (entity: any) => entity.type === "table"
        );
        if (tables.length) {
          importState = status.add(
            `<p><strong>Importing ${tables.length} RollTables...</strong> </p>`,
            "pending"
          );
          const importResult = await Tools.entity.import(tables); //await importEntities(tables);
          logger.info("RollTables imported", importResult);
          status.edit(
            importState.id,
            `<p><strong>Importing ${tables.length} RollTables... Done.</strong> </p>`,
            "success"
          );
        } else {
          status.add(
            `<p><strong>No RollTables found in this import, continuing.</strong> </p>`,
            "success"
          );
        }

        /**
         * All there is left to do is to send a list of JournalEntries to post process to Foundry
         */
        if (journals.length > 0) {
          importState = status.add(
            `<p><strong>Starting post-processing...</strong> With all entities avaible in your world, we can now fix all the links in the Journal Entries to point to the correct entities. Almost done!</p>`,
            "pending"
          );

          const message = {
            type: "FVTT_MESSAGE",
            data: {
              type: "POSTPROCESS",
              data: journals.map((journal: any) => journal.flags.vtta.id),
            },
          };

          chrome.runtime.sendMessage(message, (response) => {
            status.clear();
            const title = document.title.split("-").shift().trim();
            status.add(
              "<p><strong>Done!</strong></p><p>Everything is imported and ready to use. Have fun running <strong>" +
                title +
                "</strong> with your party!</p>",
              "success"
            );

            status.complete(true);
            Batch.stop();
          });
        } else {
          // We are done early, no postprocessing necessary
          status.clear();
          const title = document.title.split("-").shift().trim();
          status.add(
            "<p><strong>Done!</strong></p><p>Everything is imported and ready to use. Have fun running <strong>" +
              title +
              "</strong> with your party!</p>",
            "success"
          );

          status.complete(true);
          Batch.stop();
        }
      }

      break;

    /**
     * That should not happen. Only one ToC page should be visted: At the beginning and the end
     * of a batch process
     */
    case "RUNNING":
      // I really don't know why we came here in the first place... this is odd.
      // lets stop here though
      logger.warn(
        "Batch mode is running, but we are on a Table of Contents page. What is happening?"
      );
      const batch = await Batch.load();
      logger.warn("Current batch", batch);
      logger.warn("I am stopping the batch now");

      Batch.stop();
      break;
  }
};

try {
  main();
} catch (error) {
  logger.error(error);
}
