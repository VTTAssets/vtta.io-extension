/// <reference path="messages.d.ts" />
/// <reference path="dndbeyond.d.ts" />
/// <reference path="batch.d.ts" />
/// <reference path="jquery.d.ts" />

/**
 * A message passed from one of the extension's components to the other
 * Contains a message type and optional data
 */
interface Message {
  type: string;
  data?: any;
}

/**
 * Message handlers take care to act on specific messages. A message router finds the appropriate message handler and takes care of handling all messages
 */
interface MessageHandlerDefinition {
  type: string;
  handler: MessageHandler;
}

type MessageHandlerResponse = {
  success: boolean;
  data?: any;
};

type MessageCallback = (response?: MessageHandlerResponse) => void;

type MessageHandler = (
  data: any,
  sender: chrome.runtime.MessageSender,
  callback?: MessageCallback
) => Promise<MessageHandlerResponse | void> | boolean;

interface QueryInterface {
  get: (url: string) => Promise<any>;
  post: (url: string, input: any) => Promise<any>;
}

interface User {
  //  id: string;
  name?: string;
  email?: string;
  token?: string;
  permissions?: string[];
  isPatron?: boolean;
}

/**
 * Foundry message relay
 */

interface StackEntry {
  id: string;
  callback: MessageCallback;
}
