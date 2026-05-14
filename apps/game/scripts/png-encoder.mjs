/**
 * Tiny pure-Node PNG encoder. Uses Node's built-in `zlib` for the IDAT
 * deflate stream and a small CRC-32 table; no external deps.
 *
 * Only supports the colour-type-6 (RGBA, 8-bit/channel) variant — that's
 * all the BMFont atlas needs. Width/height are caller-supplied; pixels
 * are addressed with `setPixel(x,y,r,g,b,a)`. Call `encode()` once to
 * get a Buffer ready for `writeFile`.
 *
 * Public domain (CC0) — extracted from PNG spec § 5 + RFC 1951.
 */
import { deflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n >>> 0;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) !== 0 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : (c >>> 1) >>> 0;
    }
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = (CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)) >>> 0;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

export class PNG {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // Raw scanlines: each row prefixed with a filter byte (0 = None).
    // Row stride = 1 (filter) + 4 (RGBA) * width.
    this.rowStride = 1 + 4 * width;
    this.data = Buffer.alloc(this.rowStride * height); // zero-init = transparent
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r 0..255
   * @param {number} g 0..255
   * @param {number} b 0..255
   * @param {number} a 0..255
   */
  setPixel(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const offset = y * this.rowStride + 1 + x * 4;
    this.data[offset] = r;
    this.data[offset + 1] = g;
    this.data[offset + 2] = b;
    this.data[offset + 3] = a;
  }

  encode() {
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.width, 0);
    ihdr.writeUInt32BE(this.height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // colour type — RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const idatData = deflateSync(this.data);
    const ihdrChunk = makeChunk("IHDR", ihdr);
    const idatChunk = makeChunk("IDAT", idatData);
    const iendChunk = makeChunk("IEND", Buffer.alloc(0));
    return Buffer.concat([SIGNATURE, ihdrChunk, idatChunk, iendChunk]);
  }
}
