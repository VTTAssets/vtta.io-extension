import getPageInfo from "../page/getPageInfo";
import Parser from "../parsing/index";
import Messages from "../../../utilities/ui/messages";
import logger from "../../../utilities/logging/index";

export default (env: Environment, pageInfo: PageInfo, itemData: ItemData) => {
  // depending on the page entity, we will process the block differently
  const infoPanel = Messages($("header.page-header"), {
    position: "append",
  });

  // if we have an update available, we will do that without user interaction
  switch (itemData.status) {
    case "IMPORT":
      {
        logger.info("Missing entity", itemData);

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
        logger.info("No Update necessary", itemData);
        infoPanel.add("Up to Date", "success");
      }
      break;
    case "UPDATE":
      {
        logger.info("Updating entity", itemData);
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
