/**
 * Updates the FVTT connection state button visually to reflect the current state of connection
 * @param state Desired connection state
 */

const updateConnectionStateButton = (
  state: "connected" | "error" | "pending"
) => {
  const button = $("#connect-fvtt");
  const icon = $("#connect-fvtt i.icon");

  const BUTTON_STATES = new Map([
    ["connected", "green"],
    ["pending", "yellow loading"],
    ["error", "red"],
  ]);

  let toRemove = "";
  let toAdd = "";
  BUTTON_STATES.forEach((value, key) => {
    if (key === state) toAdd = value;
    else toRemove += " " + value;
  });

  $(button).removeClass(toRemove);
  $(button).addClass(toAdd);

  if (state === "connected") {
    $(button).attr(
      "data-tooltip",
      "Clicking me brings the connected FVTT tab to the foreground"
    );
    $(button).attr("data-position", "bottom right");
  } else {
    $(button).removeAttr("data-tooltip");
  }

  const ICON_STATES = new Map([
    ["connected", "arrow circle up"],
    ["pending", "question circle "],
    ["error", "arrow circle down"],
  ]);

  ICON_STATES.forEach((value, key) => {
    if (key === state) toAdd = value;
    else toRemove += " " + value;
  });

  console.log("Icon toRemove: " + toRemove + ", to Add: " + toAdd);
  $(icon).removeClass(toRemove);
  $(icon).addClass(toAdd);
};

export default updateConnectionStateButton;
