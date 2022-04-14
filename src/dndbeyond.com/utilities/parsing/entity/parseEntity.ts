import logger from "../../../../utilities/logging/index";
import { mergeDeep } from "../../../../utilities/data/index";
import ParsingError from "./ParsingError";
import { Parser } from "../../../../utilities/api/index";

const parseEntity = async (
  slug: string,
  name: string,
  supplement: Supplement,
  html: string
): Promise<any> => {
  var urlslug = slug.replace(/(.*)\/([0-9]+-)(.*)/, function(s, type , id, name){ 
    if (type === 'magic-items' && id != null){
        return type + '/' + name; 
    }
    return s;
  });

  const parser = await Parser(slug);

  if (!parser) throw new ParsingError(slug, "I don't know how to parse that.");

  let result;
  try {
    //const data = { content: html, name: supplement.name };
    result = await parser.post(urlslug, { content: html, name: name });
    logger.debug("Parse result for " + slug, [supplement, result]);
  } catch (error) {
    logger.error("Error /w API [POST]", result);
    logger.error(error);
    throw new ParsingError(slug, error);
  }

  const isGenericIcon = (url: string | null | undefined) => {
    return (
      url !== null &&
      url !== undefined &&
      url.indexOf("images/icons/item_types/") !== -1
    );
  };

  if (result && result.success && result.entities) {
    return result.entities.map((entity: any) => {
      // The extension processor will be in charge: If we supplement an image, it will always take precedence over any
      // Image precedence:
      // Monsters: supplement only
      // Equipment: parser, supplement
      // Magic Items: supplement (if non-default icon), parser, supplement (default icon)
      // Spells: parser only
      const type = slug.split("/").shift();
      switch (type) {
        case "magic-items":
          // non-default-icon on supplement
          if (isGenericIcon(supplement.img)) {
            logger.debug("Generic Icon detected: " + supplement.img);
            if (entity.img) {
              logger.debug("Replacing with Parser Icon: " + entity.img);
              supplement.img = entity.img;
            }
          } else {
            logger.debug("Custom Icon detected: " + supplement.img);
          }

          break;
        case "equipment":
          if (entity.img) {
            supplement.img = entity.img;
          }
          // Nothing found at all, delete the key and let Foundry assign the default img
          if (!supplement.img) {
            delete entity.img;
            delete supplement.img;
          }
          break;
        case "monsters":
          if (!supplement.img) {
            delete entity.img;
            delete supplement.img;
          }
          break;
        case "spells":
          if (entity.img) {
            supplement.img = entity.img;
          } else {
            delete entity.img;
            delete supplement.img;
          }
          break;
      }

      // images returned by the parser
      if (entity.img && !supplement.img) {
        supplement.img = entity.img;
      }
      //supplement.img = entity.img ? entity.img : supplement.img;
      return mergeDeep(entity, supplement);
    });
  } else {
    logger.error("Parsing Error: " + slug, result);
    throw new ParsingError(slug, result);
  }
};

export default parseEntity;
