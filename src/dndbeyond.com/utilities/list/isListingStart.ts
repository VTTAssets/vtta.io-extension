import getPageNo from "./getPageNo";
/**
 * Checks if the currently displayed listing page is the first one
 * @returns {boolean} true, if it's page no. 1 and false otherwise
 */
export default () => {
  return getPageNo() === 1;
};
