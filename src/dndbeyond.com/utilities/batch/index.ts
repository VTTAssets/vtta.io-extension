import load from "./load";
import save from "./save";
import start from "./start";
import update from "./update";
import checkOff from "./checkOff";
import stop from "./stop";
import get from "./get";
import add from "./add";

export const DEFAULT_BATCH: Batch = {
  batchId: "",
  code: "",
  id: 0,
  name: "",
  pages: [],
  start: "",
  character: 0,
  cover: "",
  status: "NONE",
};

export default {
  add,
  get,
  load,
  save,
  start,
  update,
  checkOff,
  stop,
};
