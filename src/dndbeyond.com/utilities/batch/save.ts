import Storage from "../../../utilities/storage/index";

const save = async (data: Batch) => {
  await Storage.local.set({ batch: data });
};

export default save;
