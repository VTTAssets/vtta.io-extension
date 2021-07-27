/**
 * Checks if the currently displayed page is a listing
 * @returns {boolean} true, if the currently displayed page is a listing instead of a detail view
 */
export default (): boolean => {
  const VALID_PATHS = ["/monsters", "/spells", "/magic-items", "/equipment"];
  const url = new URL(document.URL);
  const segments = url.pathname
    .split("/")
    .filter((pathname) => pathname.length > 0);

  return (
    VALID_PATHS.includes(`/${segments[0]}`) &&
    segments.length === 2 &&
    url.search.length === 0
  );
};
