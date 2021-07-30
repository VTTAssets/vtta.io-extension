export default class ParsingError extends Error {
  message: string;
  result: any;

  constructor(slug: string, result: any) {
    super(`${slug}`);
    this.name = "ParsingError";
    this.result = result;
  }
}
