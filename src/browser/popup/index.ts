import logger from "../../utilities/logging/index";
import CONFIG from "../../config/index";
import Storage from "../../utilities/storage/index";
import Batch from "../../dndbeyond.com/utilities/batch";
import MessageRouter from "./messages/index";
import updateConnectionStateButton from "./ui/updateConnectionStateButton";
import updateEnvironmentInformation from "./ui/updateEnvironmentInformation";

import Note from "./ui/note";

console.log("[POPUP] Initializing...");

const init = async () => {
  /** Signaling the pressing of the action button to the service worker */
  const message: Message = {
    type: CONFIG.messages.ACTION,
  };
  chrome.runtime.sendMessage(message, (response) => {
    logger.info("Response received from ACTION event", response);

    if (response.success) {
      logger.info("FVTT is connected already");
      updateConnectionStateButton("connected");
    } else {
      logger.info("FVTT is not yet connected");

      const message = response?.data?.message;
      if (message) {
        switch (message) {
          case "Connection initiated":
            logger.info(
              "FVTT is currenctly connecting, waiting for the success message"
            );
            updateConnectionStateButton("pending");
            break;
          case "ActiveTab not Foundry VTT":
            logger.info("FVTT is not in the ActiveTab");
            updateConnectionStateButton("error");
            Note.display(
              "error",
              "This is not a Foundry VTT server",
              `<p>I can only connect to the currently active, ie. displayed browser tab. Bring your Foundry tab to the foreground and try again.</p>`,
              10000
            );
        }
      }
      if (
        response.data &&
        response.data.message &&
        response.data.message === "Connection initiated"
      ) {
      }
    }
  });

  /**
   * Displaying user information and environment information
   */
  const { user, environment } = await Storage.sync.get(["user", "environment"]);

  // Display the current user's information
  $("#profile-name").empty();

  // we do have a valid user
  if (user && user.name) {
    $("#profile-name").prepend(
      `<i class="patreon icon" style="color: ${
        user.isPatron ? "orange" : "gray"
      }" ></i> ${user.name}`
    );

    $("#profile-clear").show();
  } else {
    // there is no user connected yet
    $("#profile-name").prepend(
      `<i class="patreon icon" style="color:gray"> </i> No user connected`
    );
    $("#profile-clear").hide();

    Note.display(
      "warning",
      "No user connected",
      `
    <p>You have no user connected. Unless you are running your own image proxy, <b>all image downloads from D&amp;D Beyond will fail</b>, resulting in <b>monsters having no artworks and source book/ adventure 
    module imports not completing successfully at all</b>. Read more in the <a href="https://www.vtta.io/articles/getting-started#step-2-account">"Getting Started" guide</a> or simply:</p>
    <ul>
    <li>Go to <a href="https://www.vtta.io">vtta.io</a> and login with your Google account</li>
    <li>Visit your user profile, a success message will appear after a short delay, indicating that the connection is now established. </li>
    </ul>`,
      null
    );
  }

  /**
   * Clearing the stored user profile
   */
  $("#profile-clear").on("click", () => {
    Storage.sync.remove(["user"]);
    window.location.reload();
  });

  /**
   * Parser environment indicator
   */

  updateEnvironmentInformation(environment);
  // let env = CONFIG.environments.find((env) => env.name === environment);
  // if (env === undefined) {
  //   $("#profile-environment")
  //     .find("img")
  //     .attr(
  //       "src",
  //       chrome.runtime.getURL("/assets/icons/icon-env-unconfigured-48x48.png")
  //     );
  //   $("#profile-environment").attr(
  //     "data-tooltip",
  //     "Connecting a user sets a valid parser environment"
  //   );
  //   $("#profile-environment").on("click", (event) => {
  //     console.log("Clicked on the environment button");
  //   });
  // } else {
  //   $("#profile-environment")
  //     .find("img")
  //     .attr("src", chrome.runtime.getURL(env.icon));
  //   $("#profile-environment").attr("data-tooltip", env.description);

  //   $("#profile-environment").on("click", (event) => {
  //     console.log("Clicked on the environment button");
  //   });
  // }

  /**
   * Is there currently a batch running? Allow the user to cancel it
   */
  const batch = await Batch.load();
  $("#cancel-batch").removeClass("gray red");

  if (batch.status === "NONE") {
    $("#cancel-batch")
      .prop("disabled", true)
      .addClass("gray")
      .removeClass("red");
    //.html("Batch");
  } else {
    $("#cancel-batch")
      .prop("disabled", false)
      .addClass("red")
      .removeClass("gray");
    //.html("Batch");
  }
  $("#cancel-batch").on("click", (event) => {
    if (batch.status !== "RUNNING") return;

    Batch.stop().then((redirect: string) => {
      $("#cancel-batch")
        .prop("disabled", true)
        .addClass("gray")
        .removeClass("red");
      //.html("Batch");
      Note.display(
        "success",
        "Batch stopped",
        "The current batch was stopped successfully."
      );
    });
  });

  /**
   * Bringing the FVTT tab into the foreground (if connected);
   */
  $("#connect-fvtt").on("click", async (event) => {
    if (!$("#connect-fvtt").hasClass("green")) return;
    const { target } = await Storage.local.get(["target"]);

    if (target) {
      var updateProperties = { active: true };
      chrome.tabs.update(target, updateProperties, (tab) => {});
    }
  });
};

// start listening to messages
chrome.runtime.onMessage.addListener(MessageRouter);

init();
