interface Supplement {
  name?: string;
  img?: string;
  data?: any;
  flags?: any;
}

interface BasicInfo {
  name: string;
  img: string;
  slug: string;
  source: string;
  dataUrl?: string;
}

type PROCESSING_MODE_AUTOMATIC = "PROCESSING_MODE_AUTOMATIC";
type PROCESSING_MODE_MANUAL = "PROCESSING_MODE_MANUAL";
type PROCESSING_MODE = PROCESSING_MODE_AUTOMATIC | PROCESSING_MODE_MANUAL;

interface Environment {
  user: User;
  batch: BatchStep;
  isFoundryConnected: boolean;
  processingMode: PROCESSING_MODE;
}

type PageViewMode =
  | "DETAIL"
  | "LISTING"
  | "ENCOUNTERBUILDER"
  | "TOC"
  | "PAGE"
  | "MARKETPLACE";
interface PageInfo {
  entity:
    | "monsters"
    | "magic-items"
    | "spells"
    | "equipment"
    | "sources"
    | "unknown";
  entityName: string;
  view: PageViewMode;
  next: string | null;
}

interface Page {
  info: PageInfo;
  env: Environment;
}

interface ItemDetails {
  name: string | null;
  url: string | null;
  slug: string;
  img?: string;
  status: "IMPORT" | "UPDATE" | "NOOP";
}

interface ItemData {
  name: string | null;
  slug: string;
  img?: string;
  status: "IMPORT" | "UPDATE" | "NOOP";
  data: string;
}

interface SourceInfo {
  batchId: string;
  success: boolean;
  message?: string;
  id: number;
  name: string;
  code: string;
  start: string;
  end: string;
  pages: string[];
  character: number;
}
