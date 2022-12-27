import { Router } from "../deps.ts";

export const ROOM_API = new Router({ prefix: "/api/room" });

ROOM_API.get("/:roomID", (_ctx) => {
  // 1. Fetch roomID from state
  // 2. Return 400 bad request if `roomID` not found
  // 3. else Return 200 OK with room info
});

ROOM_API.post("/", (_ctx) => {
  // 1. Get roomName & optional passwd from body
  // 2. Generate a room ID
  // 3. Send request to `game-server` to create a new match.
  // 4. Insert into state the following object { roomName: string, passwd: string, creationDate: Date, players: string[] }
});
