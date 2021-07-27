import getListItem from "./getListItem";
/**
 * Retrieves the basic details of each list, along with URLs to retrieve more-info
 */
export default async (): Promise<ItemData[]> => {
  if (new URL(document.URL).pathname.split("/").includes("equipment")) {
    // equipment is handled a tad differently, it has the data-url as a attribute and the list structure is a bit different, too
    let elements = $("ul.listing div.list-row").toArray();
    if (elements.length) {
      const items = await Promise.all(
        elements.map((element) => getListItem(element))
      );

      return items.filter((item) => item !== null);
    }
  } else {
    // magic-items, monsters, spells
    let elements = $("ul.listing > div.info").toArray();
    if (elements.length) {
      const items = await Promise.all(
        elements.map((element) => getListItem(element))
      );

      return items.filter((item) => item !== null);
    } else {
      return [];
    }
  }
};
