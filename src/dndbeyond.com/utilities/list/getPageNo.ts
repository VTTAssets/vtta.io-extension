import isListing from "./isListing";
/**
 * Retrieves the page of the list currently displayed
 * @returns {number} the page search parameter of the current URL
 */
export default (): number => {
  if (!isListing()) return 0;

  const url = new URL(document.URL);
  if (url.searchParams.has("page")) {
    const page = parseInt(url.searchParams.get("page"));
    return page;
  } else {
    return 1;
  }
};
