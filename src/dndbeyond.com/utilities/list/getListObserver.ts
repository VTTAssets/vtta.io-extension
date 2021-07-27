import BlockObserver from "../block/observer";
import getPageInfo from "../page/getPageInfo";
import getListItem from "./getListItem";
import Block from "../block/listBlock";
import logger from "../../../utilities/logging/index";

export default (env: Environment) => {
  const blockObserver = BlockObserver();

  const pageInfo = getPageInfo();

  const filterBlock = (node: Node) => {
    if (node.nodeName !== "DIV") return false;

    switch (pageInfo.entity) {
      case "monsters":
        return (
          $(node).hasClass("more-info-monster") || // monster listing
          $(node).hasClass("monster-row__stat-block mon-stat-block") // encounter builder
        );
      case "equipment":
        return $(node).hasClass("more-info");
      case "spells":
        return $(node).hasClass("more-info-spell");
      case "magic-items":
        return $(node).hasClass("more-info-magic-item");
    }
    return false;
  };

  // configure the observer
  const obs = new MutationObserver((mutations) => {
    mutations.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach(async (node) => {
        if (filterBlock(node)) {
          // get the previous list
          // get the details of this node

          let listItemDetails;
          if (pageInfo.view === "ENCOUNTERBUILDER") {
            // encounter builder has a loading animation within a surrounding div, so we need
            // to get the parent's sibling node for the list entry
            listItemDetails = await getListItem(
              <HTMLElement>$(node).parent().prev("div")[0]
            );
          } else {
            listItemDetails = await getListItem(
              <HTMLElement>$(node).prev("div")[0]
            );
          }

          const block = Block(
            env,
            pageInfo,
            listItemDetails,
            $(<HTMLElement>node)
          );
          blockObserver.fire(block);
        }
      });
    });
  });

  const element = $("ul.listing,div.monster-listing__body");
  if ($(element).length > 0) {
    // start the observer
    obs.observe($(element)[0], {
      childList: true,
      subtree: true,
    });

    return blockObserver;
  } else {
    logger.info("No Listing found on page, aborting analysis.");
  }
};
