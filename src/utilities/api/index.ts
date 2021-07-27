import logger from "../logging/index";
import CONFIG from "Config/index";
import Query from "./Query";
import Storage from "../storage/index";

/**
 * Retrieves a Query object to interact with the API
 * @returns The Query to work with the API, depending on the set environment
 */
export const API = async () => {
  logger.info("[API: Init] Getting environment and user from sync storage");
  const { environment, user } = await Storage.sync.get(["environment", "user"]);
  logger.info("[API: Init] Result", { environment, user });

  let config = CONFIG.environments.find((env) => env.name === environment);
  if (!config) config = CONFIG.environments.find((env) => env.isDefault);

  logger.info("[API: Init] Config addressing environment:", config);

  return Query(
    config.api.default,
    user && user.token ? user.token : "anonymous"
  );
};

/**
 * Retrieves a Parser object to interact with the API
 * @returns The Query to work with the API, depending on the set environment
 */
export const Parser = async (slug: string) => {
  logger.info("[API: Init] Getting environment and user from sync storage");
  const { environment, user } = await Storage.sync.get(["environment", "user"]);
  logger.info("[API: Init] Result", { environment, user });

  const entityType = slug.split("/").shift();
  const PARSERS = new Map([
    ["magic-items", "items"],
    ["equipment", "items"],
    ["spells", "spells"],
    ["monsters", "monsters"],
    ["sources", "sources"],
  ]);
  const PARSER = <undefined | "items" | "spells" | "monsters" | "sources">(
    PARSERS.get(entityType)
  );
  if (!PARSER) throw "Unknown parser";

  let config = CONFIG.environments.find((env) => env.name === environment);
  if (!config) config = CONFIG.environments.find((env) => env.isDefault);

  const parserHost: string | undefined = config.parser[PARSER];
  if (parserHost === undefined)
    throw `Unknown parser: ${entityType} for environment ${config.label}`;
  return Query(parserHost, user && user.token ? user.token : "anonymous");
};
