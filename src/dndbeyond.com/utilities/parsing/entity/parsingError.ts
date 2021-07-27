export default class ParsingError extends Error {
  message: string;
  result: any;

  constructor(message: string, result: any) {
    super(message);
    this.name = "ParsingError";
    this.result = result;
  }
}
