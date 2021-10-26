// MISC

export interface GameWin {
  type: "game_win";
}

export interface GameLoss {
  type: "game_loss";
}

export interface GameDraw {
  type: "game_draw";
}

export interface GameStart {
  type: "game_start";
}

export interface GameError {
  type: "error";
  error: string;
  message: string;
}

export interface ChatMessage {
  type: "chat_message";
  message: string;
  user: string;
}

export type AnyMiscEvent =
  | GameWin
  | GameLoss
  | GameDraw
  | GameStart
  | GameError
  | ChatMessage;
