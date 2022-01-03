// MISC

export interface Timer {
  type: "timer";
  date: string;
}

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
  // opponent: string;
}

export interface ServerError {
  type: "error";
  error: string;
  message: string;
}

export interface ChatMessage {
  type: "chat_message";
  message: string;
  user: string;
}

export interface GameCancel {
  type: "game_cancel";
  reason: string;
}

export type AnyMiscEvent =
  | GameWin
  | GameLoss
  | GameDraw
  | GameStart
  | ServerError
  | ChatMessage
  | GameCancel
  | Timer;
