import load from "./load";
import save from "./save";
import Storage from "../../../utilities/storage/index";

const checkOff = async (urls: string[] | string) => {
  let batch = await load();

  if (!Array.isArray(urls)) urls = [urls];
  batch.pages = batch.pages.filter((url) => !urls.includes(url));
  return save(batch);
};

export default checkOff;
