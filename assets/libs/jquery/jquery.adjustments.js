$.fn.getHtml = function () {
  let html = this.html();
  if (html) {
    return html
      .replace(/href="\/\//g, 'href="https://www.dndbeyond.com/')
      .replace(/href="\//g, 'href="https://www.dndbeyond.com/')
      .trim();
  }
  return "";
};

$.fn.outerHtml = function () {
  const parent = $(this).parent();
  return $(
    `<${parent.nodeName} class="${parent.className}"></${parent.nodeName}>`
  )
    .append(this.clone())
    .html();
};

$.fn.getHref = function () {
  let href = this.attr("href");
  if (href) {
    return href
      .replace(/^\/\//, "https")
      .replace(/^\//, "https://www.dndbeyond.com/")
      .trim();
  }
  return null;
};

$.fn.getBackgroundImage = function () {
  let css = this.css("background-image");
  if (css) {
    css = css.substring('url("'.length, css.length - '")'.length);
    if (css.indexOf("//") === 0) css = "https:" + css;
    if (css.indexOf("/") === 0) css = "https://www.dndbeyond.com" + css;
    return css;
  }
  return null;
};

// return text trimmed
$.fn.getText = function () {
  return this.text().trim();
};
