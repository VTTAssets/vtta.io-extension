export default (icon: JQuery<HTMLElement>): string | null => {
  let img = null;
  if (icon.length) {
    const node = icon[0];
    switch (node.nodeName) {
      case "A":
        img = $(node).attr("href");
        if (img)
          img = img
            .replace(/^\/\//, "https://")
            .replace(/^\//, "https://www.dndbeyond.com/")
            .trim();
        break;
      case "DIV":
        // check if it's a generic type
        img = $(node).css("background-image");
        if (img) {
          img = img
            .substring('url("'.length, img.length - '")'.length)
            .replace(/^\/\//, "https://")
            .replace(/^\//, "https://www.dndbeyond.com/")
            .trim();
        }
        break;
    }
  }
  // magic-items and equipment: it's an generic icon, we will find a better suiting one in the parser. Hopefully.
  // spells: filter all icons
  // we will leave the monster default icons for vtta-tokens
  if (
    img !== null &&
    (img.indexOf("images/spell-schools/") !== -1 ||
      img.indexOf("images/icons/item_types/") !== -1)
  ) {
    img = null;
  }
  return img;
};
