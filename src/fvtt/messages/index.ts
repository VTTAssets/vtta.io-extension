import onPing from "./terminated/onPing";
import defaultHandler from "./relayed/default";
import Router from "../../utilities/router/index";

/**
 * Registering all possible Messages
 */
export default Router("FVTT", "RELAY", [onPing], defaultHandler);
