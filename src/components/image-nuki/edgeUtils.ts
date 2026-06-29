// All operations work on raw RGBA Uint8ClampedArray + (width, height)

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** Convert blob → {data, w, h} via OffscreenCanvas */
export async function blobToImageData(blob: Blob): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
  const bitmap = await createImageBitmap(blob);
  const { width: w, height: h } = bitmap;
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const id = ctx.getImageData(0, 0, w, h);
  return { data: new Uint8ClampedArray(id.data), w, h };
}

/** Convert Uint8ClampedArray → PNG Blob */
export async function imageDataToBlob(data: Uint8ClampedArray, w: number, h: number): Promise<Blob> {
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  const id = new ImageData(new Uint8ClampedArray(data.buffer as ArrayBuffer), w, h);
  ctx.putImageData(id, 0, 0);
  return canvas.convertToBlob({ type: "image/png" });
}

/**
 * Auto-detect background color by sampling original image pixels
 * that are now fully transparent in the nukki result.
 */
export async function detectBgColor(originalFile: File, resultData: Uint8ClampedArray, w: number, h: number): Promise<[number, number, number]> {
  const origBlob = originalFile;
  const orig = await blobToImageData(origBlob);

  // Scale original to result dimensions if needed
  let origData = orig.data;
  if (orig.w !== w || orig.h !== h) {
    const bm = await createImageBitmap(originalFile);
    const c = new OffscreenCanvas(w, h);
    const cx = c.getContext("2d")!;
    cx.drawImage(bm, 0, 0, w, h);
    bm.close();
    origData = new Uint8ClampedArray(cx.getImageData(0, 0, w, h).data);
  }

  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < resultData.length; i += 4) {
    if (resultData[i + 3] < 10) {
      r += origData[i];
      g += origData[i + 1];
      b += origData[i + 2];
      count++;
    }
  }
  if (count === 0) return [0, 0, 0];
  return [r / count, g / count, b / count];
}

/**
 * Matte removal: reconstruct true foreground color given background color.
 * composited = fg * a + bg * (1 - a)  →  fg = (composited - bg*(1-a)) / a
 */
export function removeMatte(
  data: Uint8ClampedArray, w: number, h: number,
  bgR: number, bgG: number, bgB: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a === 0 || a === 255) continue;
    const ratio = a / 255;
    out[i]     = clamp((out[i]     - bgR * (1 - ratio)) / ratio);
    out[i + 1] = clamp((out[i + 1] - bgG * (1 - ratio)) / ratio);
    out[i + 2] = clamp((out[i + 2] - bgB * (1 - ratio)) / ratio);
  }
  return out;
}

/**
 * Defringe: for each semi-transparent pixel, sample surrounding transparent
 * pixels to estimate local background color, then apply matte removal.
 * More accurate than fixed-color matte for images with varied backgrounds.
 */
export function defringe(data: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data);
  const r = Math.ceil(radius);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a === 0 || a === 255) continue;

      // Estimate local bg color from fully transparent neighbors
      let bgR = 0, bgG = 0, bgB = 0, cnt = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r) continue;
          const ny = y + dy, nx = x + dx;
          if (ny < 0 || ny >= h || nx < 0 || nx >= w) continue;
          const ni = (ny * w + nx) * 4;
          if (data[ni + 3] < 10) {
            bgR += data[ni]; bgG += data[ni + 1]; bgB += data[ni + 2];
            cnt++;
          }
        }
      }

      if (cnt === 0) continue; // no transparent neighbors - skip

      bgR /= cnt; bgG /= cnt; bgB /= cnt;
      const ratio = a / 255;
      out[i]     = clamp((data[i]     - bgR * (1 - ratio)) / ratio);
      out[i + 1] = clamp((data[i + 1] - bgG * (1 - ratio)) / ratio);
      out[i + 2] = clamp((data[i + 2] - bgB * (1 - ratio)) / ratio);
    }
  }
  return out;
}

/**
 * Alpha cleanup: snap near-transparent and near-opaque pixels to 0/255.
 * Reduces fringe noise and quantization artifacts.
 */
export function cleanAlpha(data: Uint8ClampedArray, _w: number, _h: number, loThreshold = 20, hiThreshold = 235): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a < loThreshold) {
      out[i + 3] = 0;
      out[i] = out[i + 1] = out[i + 2] = 0;
    } else if (a > hiThreshold) {
      out[i + 3] = 255;
    }
  }
  return out;
}

/**
 * Shrink edge (morphological erosion on alpha channel).
 * Each pixel's alpha becomes the minimum alpha in its radius neighborhood.
 */
export function shrinkEdge(data: Uint8ClampedArray, w: number, h: number, px: number): Uint8ClampedArray {
  if (px <= 0) return new Uint8ClampedArray(data);
  const out = new Uint8ClampedArray(data);
  const r = Math.ceil(px);
  const rSq = px * px;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] === 0) continue;

      let minA = data[i + 3];
      for (let dy = -r; dy <= r && minA > 0; dy++) {
        for (let dx = -r; dx <= r && minA > 0; dx++) {
          if (dx * dx + dy * dy > rSq) continue;
          const ny = y + dy, nx = x + dx;
          if (ny < 0 || ny >= h || nx < 0 || nx >= w) {
            minA = 0;
          } else {
            const a = data[(ny * w + nx) * 4 + 3];
            if (a < minA) minA = a;
          }
        }
      }
      out[i + 3] = minA;
    }
  }
  return out;
}

/**
 * Feather: Gaussian blur applied only to the alpha channel.
 * Creates soft, anti-aliased edges.
 */
export function featherAlpha(data: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray {
  if (radius <= 0) return new Uint8ClampedArray(data);
  const out = new Uint8ClampedArray(data);
  const sigma = Math.max(radius / 2, 0.01);
  const half = Math.ceil(radius * 2);
  const size = half * 2 + 1;

  const kernel: number[] = [];
  let sum = 0;
  for (let i = 0; i < size; i++) {
    const x = i - half;
    const v = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel.push(v);
    sum += v;
  }
  for (let i = 0; i < size; i++) kernel[i] /= sum;

  const temp = new Float32Array(w * h);

  // Horizontal pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 0;
      for (let k = 0; k < size; k++) {
        const nx = x + k - half;
        if (nx >= 0 && nx < w) {
          a += data[(y * w + nx) * 4 + 3] * kernel[k];
        }
      }
      temp[y * w + x] = a;
    }
  }

  // Vertical pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 0;
      for (let k = 0; k < size; k++) {
        const ny = y + k - half;
        if (ny >= 0 && ny < h) {
          a += temp[ny * w + x] * kernel[k];
        }
      }
      out[(y * w + x) * 4 + 3] = clamp(a);
    }
  }

  return out;
}

export type MatteType = "auto" | "white" | "black";
export type ProcessOptions = {
  defringe: boolean;
  defringeRadius: number;
  cleanAlpha: boolean;
  shrink: number;
  feather: number;
  matte: MatteType | null;
  matteColor?: [number, number, number];
};

/**
 * Auto pipeline: Defringe → Alpha Clean → Shrink 1px
 */
export const AUTO_DEFAULTS: ProcessOptions = {
  defringe: true,
  defringeRadius: 2,
  cleanAlpha: true,
  shrink: 1,
  feather: 0,
  matte: null,
};

export function applyPipeline(
  data: Uint8ClampedArray, w: number, h: number,
  opts: ProcessOptions,
): Uint8ClampedArray {
  let d = new Uint8ClampedArray(data);

  // Matte removal first (color correction before alpha ops)
  if (opts.matte && opts.matteColor) {
    const [r, g, b] = opts.matteColor;
    d = removeMatte(d, w, h, r, g, b);
  }

  // Defringe (local adaptive matte removal)
  if (opts.defringe) {
    d = defringe(d, w, h, opts.defringeRadius);
  }

  // Alpha cleanup
  if (opts.cleanAlpha) {
    d = cleanAlpha(d, w, h);
  }

  // Shrink edge
  if (opts.shrink > 0) {
    d = shrinkEdge(d, w, h, opts.shrink);
  }

  // Feather
  if (opts.feather > 0) {
    d = featherAlpha(d, w, h, opts.feather);
  }

  return d;
}
