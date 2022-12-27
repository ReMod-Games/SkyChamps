# Routes

There are 2 types of routes. `/api` which handles state changes are database
queries. And then there is `/*` which is a static file server.

```
/api
  /rooms
    - GET   =>  Return all rooms with basic information like name, creation-date and status

  /room?room-id=
    - GET   =>  Get specific information about the room via room-id (url-parameters) like opponent-name, has-password and time-left-to-join

    - POST  =>  Create a new room.
                Optional password is provided via request body.
                On success will return room-id (share code) and websocket-id needed for websocket

    - PATCH =>  Join a created room via room-id (provided via body)
                room-id is provided via the request body
                On success will return websocket-id needed for websocket.

    - DELETE => Delete a created room via your websocket-id


// FUTURE
  /player/:player-name
    - GET   =>  return a player-object

  /leaderboard/:page
    - GET   =>  return the return `page * 50 - 49` up to `page * 50`
```
