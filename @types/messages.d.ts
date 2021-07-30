type MessageType =
  | "error"
  | "success"
  | "warning"
  | "pending"
  | "button"
  | "note";
type MessageId = string;
interface MessageAddResult {
  id: string;
  element: JQuery<HTMLElement>;
}

interface Messages {
  add: (
    message: string,
    type: MessageType,
    tooltip?: String
  ) => MessageAddResult;
  remove: (id: MessageId) => boolean;
  edit: (id: MessageId, message?: string | null, type?: MessageType) => boolean;
  clear: () => boolean;
}

interface MessagesOptions {
  position: "prepend" | "append";
}
