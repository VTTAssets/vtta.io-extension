import logger from "../../../../utilities/logging/index";
import parseEntity from "./parseEntity";
import importEntities from "./importEntity";

const processEntity = async (
  panel: Messages,
  slug: string,
  name: string,
  supplement: Supplement,
  html: string
) => {
  const PARSING = panel.add("Parsing", "pending");

  let entities;
  try {
    entities = await parseEntity(slug, name, supplement, html);
    if (entities.length > 1) {
      panel.add(
        "Item group detected",
        "note",
        "This item is split into " +
          entities.length +
          " individual, specialized versions during import."
      );
    }
    logger.debug("Entity parsed successfully", entities);
  } catch (error) {
    logger.error("Entity " + slug + " failed to parse", error);
    panel.edit(PARSING.id, "Parsing failed", "error");
    return { success: false, reason: "PARSE ERROR" };
  }

  // parsed successfully
  panel.edit(PARSING.id, "Parsed", "success");

  const IMPORTING = panel.add("Importing...", "pending");
  try {
    const success = await importEntities(entities);
    if (success) {
      panel.clear();
      panel.add("Imported", "success");
      return { success: true, reason: "IMPORT SUCCEEDED" };
    } else {
      panel.edit(IMPORTING.id, "Import", "error");
      return { success: false, reason: "IMPORT ERROR" };
    }
  } catch (error) {
    panel.edit(IMPORTING.id, "Import", "error");
    return { success: false, reason: "IMPORT ERROR" };
  }
};

export default processEntity;
