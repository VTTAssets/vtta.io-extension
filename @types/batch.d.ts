type BatchStatusRunning = "RUNNING";
type BatchStatusExtract = "EXTRACT";
type BatchStatusStopped = "STOPPED";
type BatchStatusDone = "DONE";
type BatchStatusNone = "NONE";

interface Entity {
  link: string;
  name: string;
}

interface Entities {
  [param: string]: Entity[];
}

interface Batch {
  batchId: string;
  code: string;
  id: number;
  name: string;
  pages?: string[];
  start: string;
  end?: string;
  character: number;
  cover?: string;

  status:
    | null
    | BatchStatusRunning
    | BatchStatusExtract
    | BatchStatusStopped
    | BatchStatusDone
    | BatchStatusNone;
}

interface BatchStep {
  batchId?: string;
  url: string;
  status:
    | BatchStatusRunning
    | BatchStatusExtract
    | BatchStatusStopped
    | BatchStatusDone
    | BatchStatusNone;
}

interface Scene {
  index: string;
  title: string;
  gm: string;
  player: string;
  sectionTitle?: string;
}

interface Level {
  level: number;
  title: string;
  link: string;
  subs?: Level[];
  scenes?: Scene[];
}

interface BatchStepResponse {
  title: string;
  url: string;
  next: null | string;
  toc: any;
  referrer: null | string;
  entities: Entities;
  scenes: [] | Scene[];
  html: string;
}

interface BatchData {
  BATCH?: Batch;
}

type BatchUpdateFailed = "FAIL";
type BatchUpdateOK = "OK";

interface BatchUpdate {
  status: BatchUpdateFailed | BatchUpdateOK;
  processed: string | string[];
  next: null | string;
}

interface Collection {
  cover: string;
  name: string;
  code: string;
  entities: Entities;
  pages: CollectionPage[];
}

interface CollectionPage {
  title: string;
  url: string;
  toc: any;
  html: string;
  scenes: Scene[];
}
