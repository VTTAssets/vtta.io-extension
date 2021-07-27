import { capitalize } from "Utilities/string";

export default (): PageInfo => {
  const pathname = new URL(document.URL).pathname;

  // special case: encounter builder
  if (pathname === "/encounter-builder") {
    return {
      entity: "monsters",
      entityName: "Monsters",
      view: "ENCOUNTERBUILDER",
      next: null,
    };
  }

  if (pathname === "/marketplace") {
    return {
      entity: "unknown",
      entityName: "Marketplace",
      view: "MARKETPLACE",
      next: null,
    };
  }

  // Special Case: Table of contents of a source book
  let matches = pathname.match(/\/sources\/(\w+)$/);
  if (matches) {
    const code = matches[1];
    return {
      entity: "sources",
      entityName: code.toLowerCase(),
      view: "TOC",
      next: null,
    };
  }

  // Special case: A sub-page of a source book
  matches = pathname.match(/\/sources\/(\w+)\/.+$/);
  if (matches) {
    const code = matches[1];
    return {
      entity: "sources",
      entityName: code.toLowerCase(),
      view: "PAGE",
      next: null,
    };
  }

  const paths = pathname.split("/").filter((part) => part.length);
  const entity = paths.shift();

  // spells/school/[schoolName] => List
  // spells/class/[className] => List
  const view = paths.length === 1 ? "DETAIL" : "LISTING";

  const nextLink = $(".listing-footer a[rel='next']");
  const next = nextLink.length ? $(nextLink).attr("href") : null;

  if (
    entity === "monsters" ||
    entity === "magic-items" ||
    entity === "spells" ||
    entity === "equipment"
  ) {
    return {
      entity,
      entityName: capitalize(entity),
      next: next,
      view: view,
    };
  }
};
