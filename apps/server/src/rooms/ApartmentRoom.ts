import { Room, type Client } from "@colyseus/core";

export class ApartmentRoom extends Room {
  override maxClients = 5;

  override onCreate(): void {
    this.setPatchRate(1000 / 20);
  }

  override onJoin(_client: Client): void {}
  override onLeave(_client: Client): void {}
}
