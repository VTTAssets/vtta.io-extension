import Batch from "../../dndbeyond.com/utilities/batch/index";
import uuid from "../uuid/index";

const Status = (title: string) => {
  // Setup of the message area
  const container = `<div class="vtta statusBar">
  <div class= "header"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png" />${title}</div>
  <div class="body">
    <div class="messages"></div>
  </div>`;
  $("body").prepend(container);

  /**
   * Adds a message to the message panel
   *
   * @param message String to display
   * @param type Message type defines styling. Possible values: error, success, warning, pending
   * @returns identifier to later edit or remove it with the corresponding methods {@link remove} or {@link edit}
   */
  const add = (
    message: string,
    type: MessageType,
    tooltip?: string
  ): MessageAddResult => {
    const id = uuid();
    const element = $(
      `<div class="message ${type}" id="${id}"${
        tooltip ? 'title="' + tooltip + '"' : ""
      }>${message}</div>`
    );
    $("body").find("div.vtta.statusBar div.messages").append(element);
    if (type === "error") {
      const bar = $("body").find("div.vtta.statusBar");
      if (bar) {
        $(bar).addClass("error");
        $(bar).find("#cancel-batch").remove();
      }
    }

    return { id, element };
  };

  const timer = (title: string, seconds: number, options?: any) => {
    return new Promise((resolve, reject) => {
      let count = 0;
      const id = uuid();
      const element = $(
        `<div class="timer">
        <div class="header">${title}</div>
        <div class="bar">
            <div class="tick" style="width: 0%"></div>
        </div>
    </div>
  </div>`
      );
      console.log("Timer options: ", options);
      let abortButton;
      if (options && options.abortable) {
        abortButton = `<div id="ABORT_IMPORT" style="margin-left: 2rem; display: flex; justify-content: center; align-items: center; background-color: #c80f0f; color: white;" class="ui basic-button vtta"><span>Abort</span></div>`;
        $(element).append(abortButton);
      }

      $("body").find("div.vtta.statusBar div.messages").append(element);

      let interval = setInterval(() => {
        count++;
        let percent =
          count === seconds
            ? 100
            : Math.min(100, Math.ceil(100 / seconds) * count);
        $(element).find(".tick").css("width", `${percent}%`);

        if (count === seconds) {
          const ANIMATION_DURATION = 1;
          setTimeout(() => {
            clearInterval(interval);
            resolve(true);
          }, ANIMATION_DURATION);
        }
      }, 1000);

      if (abortButton) {
        console.log("Registering abort handler");
        $("div.vtta.statusBar #ABORT_IMPORT").on("click", () => {
          console.log("Abort button clicked");
          clearInterval(interval);
          $(element).remove();
          reject("ABORT");
        });
      }
    });
  };

  const delay = (seconds = 3) => {
    return timer("Cleaning up...", seconds, { abortable: false });
  };

  const createCounter = (
    title: string,
    target: number,
    count?: number
  ): string => {
    const id = uuid();
    const element = $(
      `<div id="count-${id}" data-target="${target}" data-count=${
        count ? count : 0
      }" class="timer">
        <div class="header">${title}</div>
        <div class="bar">
            <div class="tick" style="width: 0%"></div>
        </div>
    </div>
  </div>`
    );
    $("body").find("div.vtta.statusBar div.messages").append(element);

    let percent =
      count === target ? 100 : Math.min(100, Math.ceil(100 / target) * count);
    //let percent = count ? Math.round((100 / target) * count) : 0;
    $(element).find(".tick").css("width", `${percent}%`);
    return id;
  };

  const updateCounter = (id: string, count: number = null) => {
    const div = $("body").find("#count-" + id);
    const target = parseInt($(div).attr("data-target"));
    const currentCount = parseInt($(div).attr("data-count"));
    if (count === null) count = currentCount + 1;
    $(div).attr("data-count", count);
    let percent =
      count === target ? 100 : Math.min(100, Math.ceil(100 / target) * count);
    //let percent = Math.min(100, count ? Math.round((100 / target) * count) : 0);
    $(div).find(".tick").css("width", `${percent}%`);
  };

  /**
   * Removes a message from the message panel
   *
   * @param id Identifier received when {@link add}ing a message
   * @returns Success of the operation
   */
  const remove = (id: MessageId): boolean => {
    const div = $("body").find("#" + id);
    if (div) {
      $(div).remove();
      return true;
    }
    return false;
  };

  /**
   * Removes a message from the message panel
   *
   * @param id Identifier received when {@link add}ing a
   * @param message New message to set. Set to null of you only want to change the message type
   * @param type (Optional) new message type for this message. Refer to {@link add} for possible values
   * @returns Success of the operation
   */
  const edit = (
    id: MessageId,
    message?: string | null,
    type?: MessageType
  ): boolean => {
    const div = $("body").find("#" + id);

    if (div.length) {
      if (message) {
        $(div).html(message);
      }
      if (type) {
        // get a class list
        const classList = $(div).attr("class").split(/\s+/);
        classList.forEach((name) => {
          if (name !== "message") {
            $(div).removeClass(name);
          }
        });
        $(div).addClass(type);
      }
      return true;
    }
    return false;
  };

  /**
   * Removes all messages from the panel
   * @returns Success of the operation
   */
  const clear = (): boolean => {
    const messages = $("body").find("div.vtta.statusBar div.messages");
    if (messages) {
      $(messages).empty();
      return true;
    }
    return false;
  };

  /**
   * Completes the Status, removing the Cancel button
   */
  const complete = (success: boolean) => {
    $("body").find(".vtta.statusBar").addClass("success");
  };

  return {
    timer,
    delay,
    add,
    remove,
    edit,
    clear,
    complete,
    counter: {
      create: createCounter,
      update: updateCounter,
    },
  };
};

export const StatusDisplay = () => {
  let status = Status("Batch import running");
  status.add(
    "<p class='note'>Pages will refresh automatically. For best results, bring the Foundry VTT tab into the foreground. You can <b>stop the batch import</b> anytime from the extension's popup window.</p>",
    "success"
  );
  return status;
};

export default Status;
