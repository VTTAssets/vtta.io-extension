export default (s: string): string => {
  return s
    .replace(/[àáâãäå]/g, "a")
    .replace(/æ/g, "ae")
    .replace(/ç/g, "c")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/ñ/g, "n")
    .replace(/[òóôõö]/g, "o")
    .replace(/œ/g, "oe")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/[’']/g, "")
    .replace(/\W+/g, "-")
    .replace(/\-\-+/g, "-")
    .replace(/^\-/, "")
    .replace(/\-$/, "")
    .toLowerCase();
};
