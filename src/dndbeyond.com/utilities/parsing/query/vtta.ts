import { Parser } from "../../../../utilities/api/index";

interface Version {
  v: number;
}

class GroupItemError extends Error {
  references: string[];
  name: string;

  constructor(message: string, references: string[]) {
    super(message);
    this.name = "GroupItemerror";
    this.references = references;
  }
}

const queryAPI = async (queryString: string): Promise<Version> => {
  const parser = await Parser(queryString);
  const result = await parser.get("/" + queryString);
  if (result.success) {
    const data = result.data;
    if (data.references) {
      throw new GroupItemError(data.name, data.references);
    }
    return { v: data.version };
  }
};

export default queryAPI;
