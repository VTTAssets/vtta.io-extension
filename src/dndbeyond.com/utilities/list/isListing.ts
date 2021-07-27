/**
 * Checks if the currently displayed page is a listing
 * @returns {boolean} true, if the currently displayed page is a listing instead of a detail view
 */
export default (): boolean => {
  const VALID_PATHS = [
    "/monsters",
    "/spells",
    "/spells/school/abjuration",
    "/spells/school/conjuration",
    "/spells/school/divination",
    "/spells/school/enchantment",
    "/spells/school/evocation",
    "/spells/school/illusion",
    "/spells/school/necromancy",
    "/spells/school/transmutation",
    "/spells/school/abjuration",
    "/spells/school/abjuration",
    "/spells/school/abjuration",
    "/magic-items",
    "/equipment",
  ];
  const url = new URL(document.URL);

  return (
    url.pathname.search(
      /\/(monsters|spells|magic-items|equipment|spells\/school\/(?:[a-z]+)|spells\/class\/(?:[a-z]+))/
    ) !== -1
  );

  return VALID_PATHS.includes(url.pathname);
};
