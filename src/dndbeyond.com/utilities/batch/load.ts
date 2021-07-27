import Storage from "../../../utilities/storage/index";
import { DEFAULT_BATCH } from "./index";

const load = async (): Promise<Batch> => {
  let { batch } = await Storage.local.get(["batch"]);
  let result = batch ? batch : DEFAULT_BATCH;
  return result;
};

export default load;
