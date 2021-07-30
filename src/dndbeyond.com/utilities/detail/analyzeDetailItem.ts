import Parser from "../parsing/index";
import logger from "../../../utilities/logging/index";
import extractImage from "./extractImage";

/**
 * Retrieves the element name and data URL for a detail item
 * @param element {HTMLElement} element to analyze
 * @returns {ItemDetails} Name and data url for this element
 */
export default async (): Promise<ItemDetails> => {
  const element = $(".primary-content");

  let result: ItemDetails = {
    name: null,
    url: null,
    slug: null,
    img: null,
    status: "NOOP",
  };

  // get the page details
  let name = $("h1.page-title").text().trim();
  let [type, slug] = new URL(document.URL).pathname
    .split("/")
    .filter((path) => path.length > 0);
  let data = {
    type: type,
    slug: slug,
  };

  // We will extract the image only for monsters and magic items. The rest have only generic icons assigned, and we will replace those later on either way.
  let icon = $(element).find("div.image > a");
  let img = extractImage(icon);

  // magic-items, spells and monsters will have a more-info link available
  // equipment items will need to extract the currently displayed HTML for parsing, with all inserted
  // buttons from other extensions as the more-info link for those is unavailable
  result.name = name;
  result.slug = `${data.type}/${data.slug}`;
  result.url =
    data.type === "equipment" ? null : `/${data.type}/${data.slug}/more-info`;
  result.img = img;

  // check the update status
  if (result.name /* && result.url */ && result.slug) {
    const fvtt = await Parser.query.fvtt(result.slug);
    logger.debug("Foundry responded: ", fvtt);
    if (fvtt.v === 0) {
      result.status = "IMPORT";
      return result;
    } else {
      const vtta = await Parser.query.vtta(result.slug);
      if (vtta.v > fvtt.v) {
        result.status = "UPDATE";
      } else {
        result.status = "NOOP";
      }
      return result;
    }
  } else {
    return result;
  }
};
