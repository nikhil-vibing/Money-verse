import type UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Phaser {
    interface Scene {
      rexUI: UIPlugin;
    }
  }
}

export type RexUIPlugin = UIPlugin;
