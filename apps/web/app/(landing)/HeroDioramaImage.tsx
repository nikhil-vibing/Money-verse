import Image from "next/image";

const SRC = "/hero/kenney-1bit-urban.png";
const NATIVE_WIDTH = 920;
const NATIVE_HEIGHT = 520;

export function HeroDioramaImage() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 select-none overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0830 0%, #2e1042 18%, #6b1d4f 38%, #c84e2e 58%, #f7b733 72%, #ffe09a 80%, #5a2240 92%, #150828 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
        style={{ imageRendering: "pixelated" }}
      >
        <Image
          src={SRC}
          alt=""
          width={NATIVE_WIDTH}
          height={NATIVE_HEIGHT}
          priority
          unoptimized
          className="h-auto w-full max-w-[1600px] object-contain object-bottom opacity-90"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,6,18,0.55) 60%, var(--color-bg) 100%)",
        }}
      />
    </div>
  );
}

export default HeroDioramaImage;
