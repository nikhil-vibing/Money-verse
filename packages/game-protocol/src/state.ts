import { MapSchema, Schema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  @type("string") sessionId = "";
  @type("string") displayName = "";
  @type("number") x = 0;
  @type("number") y = 0;
  @type("string") direction: "up" | "down" | "left" | "right" = "down";
  @type("string") emote = "";
}

export class LobbyState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class ApartmentState extends Schema {
  @type("string") hostUserId = "";
  @type({ map: PlayerState }) visitors = new MapSchema<PlayerState>();
}
