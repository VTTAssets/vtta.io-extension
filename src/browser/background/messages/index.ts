import Router from "../../../utilities/router/index";

// routed/ terminated messags
import onAction from "./terminated/onAction";
import onExternalProfileConnect from "./terminated/onExternalProfileConnect";
import onFVTTConnectionEstablished from "./terminated/onFVTTConnectionEstablished";

// relayed messages
import onPing from "./relayed/onPing";
import onFoundry from "./relayed/onFoundry";
import defaultRelay from "./relayed/default";

/**
 * Registering all possible Messages
 */
export default {
  router: Router("BACKGROUND", "ROUTER", [
    onAction,
    onFVTTConnectionEstablished,
  ]),
  relay: Router("BACKGROUND", "RELAY", [onPing, onFoundry]),
  external: Router("BACKGROUND:EXTERNAL", "ROUTER", [onExternalProfileConnect]),
};
