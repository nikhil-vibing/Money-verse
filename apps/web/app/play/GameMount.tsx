"use client";

import { useEffect, useRef } from "react";

export default function GameMount() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: { destroy: (a: boolean) => void } | undefined;
    void (async () => {
      const Phaser = await import("phaser");
      const { BootScene } = await import("../../../game/src/scenes/BootScene");
      const { PreloadScene } = await import(
        "../../../game/src/scenes/PreloadScene"
      );
      const { WorldScene } = await import(
        "../../../game/src/scenes/WorldScene"
      );
      const { UIScene } = await import("../../../game/src/scenes/UIScene");
      const { DialogScene } = await import(
        "../../../game/src/scenes/DialogScene"
      );

      game = new Phaser.Game({
        type: Phaser.WEBGL,
        parent: ref.current ?? undefined,
        backgroundColor: "#0a0612",
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [BootScene, PreloadScene, WorldScene, UIScene, DialogScene],
      });
    })();
    return () => game?.destroy(true);
  }, []);

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Dhaniverse game"
      className="h-screen w-screen"
    />
  );
}
