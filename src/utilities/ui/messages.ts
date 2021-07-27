import uuid from "../uuid/index";

const messages = (parent: JQuery, options?: MessagesOptions): Messages => {
  // Setup of the message area
  const container = `<div class="vtta messageBar"><div class= "header"><img src="chrome-extension://${chrome.runtime.id}/assets/icons/vtta.io-s-32x32.png" /></div><div class="messages"></div></div>`;
  if (options) {
    if (options.position && options.position === "prepend") {
      $(parent).prepend(container);
    }

    if (options.position && options.position === "append") {
      $(parent).append(container);
    }
  } else {
    $(parent).append(container);
  }

  /**
   * Adds a message to the message panel
   *
   * @param message String to display
   * @param type Message type defines styling. Possible values: error, success, warning, pending
   * @param tooltip Message tooltip, optional
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
    $(parent).find("div.vtta.messageBar div.messages").append(element);
    return { id, element };
  };

  /**
   * Removes a message from the message panel
   *
   * @param id Identifier received when {@link add}ing a message
   * @returns Success of the operation
   */
  const remove = (id: MessageId): boolean => {
    const div = $(parent).find("#" + id);
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
    const div = $(parent).find("#" + id);

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
    const messages = $(parent).find("div.vtta.messageBar div.messages");
    if (messages) {
      $(messages).empty();
      return true;
    }
    return false;
  };

  return {
    add,
    remove,
    edit,
    clear,
  };
};

export default messages;
