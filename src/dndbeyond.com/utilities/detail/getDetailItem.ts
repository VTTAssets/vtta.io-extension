import logger from "../../../utilities/logging/index";
import load from "../loadContent/index";
import { transform } from "../loadContent/transform";

import analyzeDetailItem from "./analyzeDetailItem";

/**
 * Retrieves the more-info data for a list element
 * @param element {HTMLElement} Element to analyze
 * @returns Name and data for the given element, or null if something goes wrong
 */
export default async (): Promise<ItemData | null> => {
  // get the relevant HTML Block for this kind of item
  logger.debug("getDetailItem starting...");
  // const { name, url, slug, img, status } = await analyzeDetailItem();
  const detail = await analyzeDetailItem();
  logger.debug("Detail Item", detail);

  let data = null;

  if (detail.name) {
    try {
      // retrieve the data only if necessary to avoid D&D Beyond loads
      if (detail.status !== "NOOP") {
        // monsters, magic-items and spells do have a data.url set, equipment needs to use what is currently displayed
        if (detail.url) {
          data = await load(detail.url);
        } else {
          data = transform($(".details-container-content")[0]);
        }
      }
      return {
        name: detail.name,
        data,
        slug: detail.slug,
        img: detail.img,
        status: detail.status,
      };
    } catch (error) {
      return null;
    }
  }
};
