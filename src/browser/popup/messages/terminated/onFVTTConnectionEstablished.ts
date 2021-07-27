import CONFIG from "../../../../config/index";
import logger from "../../../../utilities/logging/index";
import Note from "../../ui/note";
import updateConnectionStateButton from "../../ui/updateConnectionStateButton";

export const MESSAGE_TYPE = CONFIG.messages.FVTT_CONNECTION_ESTABLISHED;

/**
 * MessageHandler onFVTTConnectionEstablished
 * Is triggered when the connection to Foundry VTT has been established
 */
const handler: MessageHandler = async (
  message: any,
  sender: chrome.runtime.MessageSender,
  callback: MessageCallback
) => {
  logger.info("Foundry connection established", message);

  if (message.success) {
    updateConnectionStateButton("connected");

    Note.display(
      "success",
      "Successfully connected to Foundry VTT",
      `<p><b>Note:</b> If the Foundry VTT tab gets reloaded or if you go back to the setup screen, the connection will be broken again and you will need to reconnect.</p>

      <div class="ui relaxed divided list">
        <div class="item">
          <div class="content">
            <span class="header">Foundry VTT</span>
            <div class="description"><b>Core:</b> v${message.data.core.version} | <b>DnD5e</b>: ${message.data.system.version} | <b>World</b>: "${message.data.core.world}"</div>
          </div>
        </div>
        <div class="item">
          <div class="content">
            <span class="header">Modules</span>
            <div class="description"><b>vtta-core</b>: v${message.data.vtta.core} | <b>vtta-ddb</b>: v${message.data.vtta.ddb}</div>
          </div>
        </div>
      </div>`,
      null
    );
  } else {
    updateConnectionStateButton("error");
    Note.display(
      "error",
      "Could not connected to Foundry VTT",
      `<p><b>Note:</b> I have not received any response from the vtta-ddb module. Let's tick some boxes:</p>
    <ul>
      <li>Are the modules <b>vtta-core and vtta-ddb</b> installed and enabled? You can check that within Foundry in the module configuration screen.</li>
      <li>The modules must be loaded completely before trying to connect. Reload your Foundry VTT tab and wait until your world is loaded completely.</li>
      </ul>`,
      10000
    );
  }
};

const messageHandler: MessageHandlerDefinition = {
  type: MESSAGE_TYPE,
  handler: handler,
};

export default messageHandler;
