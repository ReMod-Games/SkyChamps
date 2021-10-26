export interface Disconnect {
  type: "disconnect";
}

export interface ChatMessage {
  type: "chat_message";
  message: string;
  user: string;
}

export type AnyMiscEvent = Disconnect | ChatMessage;
