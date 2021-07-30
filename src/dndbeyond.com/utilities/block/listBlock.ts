import getPageInfo from "../page/getPageInfo";
import Parser from "../parsing/index";
import Messages from "../../../utilities/ui/messages";
import logger from "../../../utilities/logging/index";

export default (
  env: Environment,
  pageInfo: PageInfo,
  itemData: ItemData,
  block: JQuery
) => {
  // depending on the page entity, we will process the block differently
  let infoPanel: Messages;

  switch (pageInfo.entity) {
    case "monsters":
      {
        infoPanel = Messages($(block).find(".mon-stat-block__header"));
      }
      break;
    case "equipment":
      {
        infoPanel = Messages($(block), {
          position: "prepend",
        });
      }
      break;
    case "spells":
      {
        infoPanel = Messages($(block).find(".more-info-body"), {
          position: "prepend",
        });
      }
      break;
    case "magic-items":
      {
        infoPanel = Messages(
          $(block).find(".more-info-body-description-upper")
        );
      }
      break;
  }

  // if we have an update available, we will do that without user interaction
  switch (itemData.status) {
    case "IMPORT":
      {
        logger.debug("Missing entity", itemData);

        const status = infoPanel.add("Missing", "note");
        const importButton = infoPanel.add("Import", "button");
        importButton.element.on("click", () => {
          Parser.entity
            .process(
              infoPanel,
              itemData.slug,
              itemData.name,
              { img: itemData.img },
              itemData.data
            )
            .then((result) => {
              if (result.success) {
                infoPanel.edit(status.id, "Imported", "success");
              } else {
                infoPanel.remove(importButton.id);
              }
            });
        });
      }
      break;
    case "NOOP":
      {
        logger.debug("No Update necessary", itemData);
        infoPanel.add("Up to Date", "success");
      }
      break;
    case "UPDATE":
      {
        logger.debug("Updating entity", itemData);
        const status = infoPanel.add("Update available", "warning");
        Parser.entity
          .process(
            infoPanel,
            itemData.slug,
            itemData.name,
            { img: itemData.img },
            itemData.data
          )
          .then((result) => {
            if (result.success) {
              infoPanel.edit(status.id, "Updated", "success");
            } else {
              infoPanel.edit(status.id, "Error on Update", "error");
            }
          });
      }
      break;
  }
};
