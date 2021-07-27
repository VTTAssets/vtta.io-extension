import load from "./load";
import Storage from "../../../utilities/storage/index";

const stop = async (): Promise<string> => {
  let batch = await load();
  await Storage.local.remove(["batch"]);
  return batch.start;
};

export default stop;
