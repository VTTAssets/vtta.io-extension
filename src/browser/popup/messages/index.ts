import onFVTTConnectionEstablished from "./terminated/onFVTTConnectionEstablished";

import Router from "../../../utilities/router/index";

/**
 * Registering all possible Messages
 */
export default Router("POPUP", "ROUTER", [onFVTTConnectionEstablished]);
