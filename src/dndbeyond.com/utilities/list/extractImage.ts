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
      case "IMG":
        img = $(node)
          .attr("src")
          .replace(/^\/\//, "https://")
          .replace(/^\//, "https://www.dndbeyond.com/")
          .trim();
        break;
    }
  }
  return img;
};
