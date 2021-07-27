import Parser from "../parsing/index";
import logger from "../../../utilities/logging/index";
import extractImage from "./extractImage";
import getPageInfo from "../page/getPageInfo";

/**
 * Retrieves the element name and data URL for a list item
 * @param element {HTMLElement} element to analyze
 * @returns {ItemDetails} Name and data url for this element
 */
export default async (element: HTMLElement): Promise<ItemDetails> => {
  let result: ItemDetails = {
    name: null,
    url: null,
    slug: null,
    img: null,
    status: "NOOP",
  };

  // Are we in a listing or encounter builder?
  const pageInfo = getPageInfo();

  logger.info("Analyzing list item", pageInfo);

  switch (pageInfo.view) {
    case "LISTING":
      {
        // equipment listing
        if (pageInfo.entity === "equipment") {
          const anchor = $(element).find(
            ".list-row-col-name > div > div.list-row-name-primary > div > a"
          );
          if (anchor) {
            result.name = $(anchor).text().trim();
            const data = $(element).data();
            // remove the leading slash
            const slug = $(anchor).attr("href").substring(1);

            if (result.name.length && data.url) {
              result.url = data.url;
              result.slug = slug;
              result.img = null;
            }
          }
        } else {
          // magic-items, monsters, spells
          result.name = $(element)
            .find("div.row > span.name > a")
            .text()
            .trim();
          const data = $(element).data();

          let icon = $(element).find("div.monster-icon > *, div.item-icon > *");
          console.log("Icon: ");
          console.log(icon);

          if (!icon) icon = $(element).find("img");
          console.log("Icon #2 attempt: ");
          console.log(icon);
          let img = extractImage(icon);
          // if (img && img.indexOf("images/icons/item_types/") !== -1) {
          //   // it's an generic icon, we will find a better suiting one in the parser. Hopefully.
          //   img = null;
          // }
          const url = `/${data.type}/${data.slug}/more-info`;
          result.url = url;
          result.slug = `${data.type}/${data.slug}`;
          result.img = img;
        }
      }
      break;
    case "ENCOUNTERBUILDER":
      {
        logger.info("Analyzing element", element);
        let icon = $(element).find("img");
        logger.info("Icon", icon);
        result.img = extractImage(icon);
        logger.info("Result of extraction", result.img);
        if (
          result.img &&
          result.img.indexOf("images/icons/item_types/") !== -1
        ) {
          // it's an generic icon, we will find a better suiting one in the parser. Hopefully.
          result.img = null;
        }

        const anchor = $(element).find(".monster-row__name");
        result.name = $(anchor).text().trim();
        result.slug = new URL(
          $(anchor).attr("href"),
          document.URL
        ).pathname.substring(1);

        result.url = `/${result.slug}/more-info`;
      }
      break;
  }

  // check the update status
  if (result.name && result.url && result.slug) {
    const fvtt = await Parser.query.fvtt(result.slug);
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
