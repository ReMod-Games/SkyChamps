export interface Room {
  roomName: string;
  passwd?: string;
  creationDate: Date;
  players: string[];
}

export interface State {
  rooms: Map<string, Room>;
}
export const STATE: State = {
  rooms: new Map(),
};
