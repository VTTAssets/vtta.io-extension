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
    module imports not completing successfully at all</b>.</p>
    <p>Our <b><a href="https://www.vtta.io/articles/getting-started#step-2-account">Getting Started</a> Guide</b> will help you on your first steps.</p>
    <p><b>Data protection is important</b> and we collect only the bare minimum of personal details. Our <a href="https://www.vtta.io/privacy-policy">Privacy Policy</a> details what kind of data is stored about you, and why. <b>Unless you create a VTTA.io account and connect it to the browser extension, no data is collected at all.</b></p>
    `,
      null
    );
  }

  /** Signaling the pressing of the action button to the service worker */
  const message: Message = {
    type: CONFIG.messages.ACTION,
  };

  const initiateActionMessage = (response: MessageHandlerResponse) => {
    logger.debug("Response received from ACTION event", response);

    if (response.success) {
      logger.debug("FVTT is connected already");
      updateConnectionStateButton("connected");
    } else {
      logger.debug("FVTT is not yet connected");

      const message = response?.data?.message;
      if (message) {
        switch (message) {
          case "Connection initiated":
            logger.debug(
              "FVTT is currenctly connecting, waiting for the success message"
            );
            updateConnectionStateButton("pending");
            break;
          case "ActiveTab not Foundry VTT":
            logger.debug("FVTT is not in the ActiveTab");
            updateConnectionStateButton("error");
            Note.display(
              "error",
              "This is (probably) not a Foundry VTT server",
              `<p>Based on your active's tab title, I think it's not a Foundry VTT server you are looking at. If I am mistaken, you can always use the red FVTT above to initiate the connection manually.
              Otherwise, bring your Foundry tab to the foreground and try again and re-open this popup to try again.</p>`,
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
  };

  chrome.runtime.sendMessage(message, initiateActionMessage);

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
    const isConnected = $("#connect-fvtt").hasClass("green");

    if (isConnected) {
      // bring the Foundry tab into the foreground
      const { target } = await Storage.local.get(["target"]);

      if (target) {
        var updateProperties = { active: true };
        chrome.tabs.update(target, updateProperties, (tab) => {});
      }
    } else {
      const message: Message = {
        type: CONFIG.messages.ACTION,
        data: {
          force: true,
        },
      };

      chrome.runtime.sendMessage(message, initiateActionMessage);
    }
  });
};

// start listening to messages
chrome.runtime.onMessage.addListener(MessageRouter);

init();
