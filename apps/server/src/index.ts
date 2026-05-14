import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { serve } from "@hono/node-server";
import { createHttpApp } from "./http/app";
import { LobbyRoom } from "./rooms/LobbyRoom";
import { ApartmentRoom } from "./rooms/ApartmentRoom";

const HTTP_PORT = Number(process.env.HTTP_PORT ?? 3001);
const WS_PORT = Number(process.env.COLYSEUS_PORT ?? 2567);

const gameServer = new Server({
  transport: new WebSocketTransport({ port: WS_PORT }),
});

gameServer.define("lobby", LobbyRoom);
gameServer.define("apartment", ApartmentRoom);

await gameServer.listen(WS_PORT);
console.log(`[colyseus] listening on :${WS_PORT}`);

serve({ fetch: createHttpApp().fetch, port: HTTP_PORT });
console.log(`[hono] listening on :${HTTP_PORT}`);
