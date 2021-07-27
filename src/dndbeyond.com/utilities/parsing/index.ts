import entity from "./entity/index";
import query from "./query/index";

import logger from "../../../utilities/logging/index";

/**
 * Queries both the FVTT server and the API for the existing version number.
 * Querystring is the same for
 * - monsters, spells:  monster/slug, spells/slug
 * Querysstring is different for
 * - equipment, magic-items: equipment/slug, magic-items/slug for API, item/slug for FVTT
 * @param user Logged-in user
 * @param queryStringAPI Querystring to send to the API for the Query. Is the same as the FoundryVTT for monsters and spells, but differs for
 * @param queryStringFVTT
 * @returns 0, if the entity is not found within Foundry
 * @returns 1, if update is available
 * @returns -1 if no update is available
 */
const versions = async (
  queryStringAPI: string,
  queryStringFVTT?: string
): Promise<number> => {
  const api = await query.vtta(queryStringAPI);
  logger.info("Version API", api);
  const fvtt = await query.fvtt(
    queryStringFVTT ? queryStringFVTT : queryStringAPI
  );
  logger.info("Version FVTT", fvtt);

  if (fvtt.v === 0) return 0;
  if (fvtt.v < api.v) return 1;
  return -1;
};

export default {
  entity: entity,
  query: {
    versions: versions,
    vtta: query.vtta,
    fvtt: query.fvtt,
  },
};
