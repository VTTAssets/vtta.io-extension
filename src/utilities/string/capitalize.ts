export default (str: string, seperator = " ") => {
  return str
    .split(seperator)
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .map((part) => part.substr(0, 1).toUpperCase() + part.substring(1))
    .join(" ");
};
