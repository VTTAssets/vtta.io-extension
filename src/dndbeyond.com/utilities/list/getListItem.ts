import load from "../loadContent/index";
import analyzeListItem from "./analyzeListItem";

/**
 * Retrieves the more-info data for a list element
 * @param element {HTMLElement} Element to analyze
 * @returns Name and data for the given element, or null if something goes wrong
 */
export default async (element: HTMLElement): Promise<ItemData | null> => {
  const { name, url, slug, img, status } = await analyzeListItem(element);
  let data = null;

  if (name && url) {
    try {
      // retrieve the data only if necessary to avoid D&D Beyond loads
      if (status !== "NOOP") {
        data = await load(url);
      }
      return { name, data, slug, img, status };
    } catch (error) {
      return null;
    }
  }
};
