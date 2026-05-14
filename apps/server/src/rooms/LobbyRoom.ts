import { Room, type Client } from "@colyseus/core";

export class LobbyRoom extends Room {
  override maxClients = 1000;

  override onCreate(): void {
    this.setPatchRate(1000 / 20);
  }

  override onJoin(client: Client): void {
    console.log(`[lobby] join ${client.sessionId}`);
  }

  override onLeave(client: Client): void {
    console.log(`[lobby] leave ${client.sessionId}`);
  }
}
