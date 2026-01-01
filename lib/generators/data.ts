/**
 * Data generation modes.
 * Generates UUIDs, colors, hex values, timestamps, coordinates, and network data.
 */

import type { GeneratorParams } from "../types";
import { clampInt, safeFiniteNumber } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";
import { getCryptoOptional } from "../core/crypto";

export function generateUUID(params: GeneratorParams): { values: string[] } {
  setCurrentMode("uuid");
  const count = clampInt(params.count, 1, 10_000, 1);
  const uppercase = Boolean(params.uuid_uppercase);
  const withHyphens = params.uuid_hyphens !== false;

  const generateOneUUID = (): string => {
    const bytes = new Uint8Array(16);
    const crypto = getCryptoOptional();
    if (crypto) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = randomIntInclusive(0, 255);
    }

    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;

    const hex = uppercase ? "0123456789ABCDEF" : "0123456789abcdef";
    const toHex = (b: number) => hex[(b >> 4) & 0xf] + hex[b & 0xf];

    if (withHyphens) {
      return (
        toHex(bytes[0]!) +
        toHex(bytes[1]!) +
        toHex(bytes[2]!) +
        toHex(bytes[3]!) +
        "-" +
        toHex(bytes[4]!) +
        toHex(bytes[5]!) +
        "-" +
        toHex(bytes[6]!) +
        toHex(bytes[7]!) +
        "-" +
        toHex(bytes[8]!) +
        toHex(bytes[9]!) +
        "-" +
        toHex(bytes[10]!) +
        toHex(bytes[11]!) +
        toHex(bytes[12]!) +
        toHex(bytes[13]!) +
        toHex(bytes[14]!) +
        toHex(bytes[15]!)
      );
    } else {
      return (
        toHex(bytes[0]!) +
        toHex(bytes[1]!) +
        toHex(bytes[2]!) +
        toHex(bytes[3]!) +
        toHex(bytes[4]!) +
        toHex(bytes[5]!) +
        toHex(bytes[6]!) +
        toHex(bytes[7]!) +
        toHex(bytes[8]!) +
        toHex(bytes[9]!) +
        toHex(bytes[10]!) +
        toHex(bytes[11]!) +
        toHex(bytes[12]!) +
        toHex(bytes[13]!) +
        toHex(bytes[14]!) +
        toHex(bytes[15]!)
      );
    }
  };

  const values = Array.from({ length: count }, generateOneUUID);
  return { values };
}

export function generateColor(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("color");
  const count = clampInt(params.count, 1, 10_000, 1);
  const format = params.color_format ?? "hex";

  const generateOneColor = (): string => {
    const r = randomIntInclusive(0, 255);
    const g = randomIntInclusive(0, 255);
    const b = randomIntInclusive(0, 255);

    switch (format) {
      case "rgb": {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
      case "hsl": {
        const rn = r / 255;
        const gn = g / 255;
        const bn = b / 255;
        const max = Math.max(rn, gn, bn);
        const min = Math.min(rn, gn, bn);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case rn:
              h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
              break;
            case gn:
              h = ((bn - rn) / d + 2) / 6;
              break;
            case bn:
              h = ((rn - gn) / d + 4) / 6;
              break;
          }
        }
        return (
          "hsl(" +
          Math.round(h * 360) +
          ", " +
          Math.round(s * 100) +
          "%, " +
          Math.round(l * 100) +
          "%)"
        );
      }
      case "hex":
      default: {
        const toHex = (n: number) =>
          (n < 16 ? "0" : "") + n.toString(16).toUpperCase();
        return "#" + toHex(r) + toHex(g) + toHex(b);
      }
    }
  };

  const values = Array.from({ length: count }, generateOneColor);
  const meta = { format };
  return { values, meta };
}

export function generateHex(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("hex");
  const count = clampInt(params.count, 1, 10_000, 1);
  const bytes = clampInt(params.hex_bytes, 1, 1024, 4);
  const withPrefix = Boolean(params.hex_prefix);
  const uppercase = true;

  const generateOneHex = (): string => {
    const byteCount = Math.max(1, bytes);
    const arr = new Uint8Array(byteCount);
    const crypto = getCryptoOptional();
    if (crypto) {
      crypto.getRandomValues(arr);
    } else {
      for (let i = 0; i < byteCount; i++) arr[i] = randomIntInclusive(0, 255);
    }

    const hexChars = uppercase ? "0123456789ABCDEF" : "0123456789abcdef";
    let result = "";
    for (let i = 0; i < byteCount; i++) {
      const b = arr[i]!;
      result += hexChars[(b >> 4) & 0xf] + hexChars[b & 0xf];
    }

    return withPrefix ? "0x" + result : result;
  };

  const values = Array.from({ length: count }, generateOneHex);
  const meta = { bytes };
  return { values, meta };
}

export function generateTimestamp(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("timestamp");
  const count = clampInt(params.count, 1, 10_000, 1);
  const format = params.timestamp_format ?? "unix";
  const defaultStart = Math.floor(Date.now() / 1000) - 31536000;
  const defaultEnd = Math.floor(Date.now() / 1000) + 31536000;
  const start = safeFiniteNumber(params.timestamp_start, defaultStart);
  const end = safeFiniteNumber(params.timestamp_end, defaultEnd);

  const [minTs, maxTs] = start <= end ? [start, end] : [end, start];

  const generateOneTimestamp = (): string => {
    const range = maxTs - minTs;
    const ts = minTs + (range > 0 ? randomIntInclusive(0, range) : 0);

    switch (format) {
      case "unix-ms":
        return String(ts * 1000 + randomIntInclusive(0, 999));
      case "iso":
        return new Date(ts * 1000).toISOString();
      case "unix":
      default:
        return String(ts);
    }
  };

  const values = Array.from({ length: count }, generateOneTimestamp);
  const meta = { format, range: { start: minTs, end: maxTs } };
  return { values, meta };
}

export function generateCoordinates(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("coordinates");
  const count = clampInt(params.count, 1, 10_000, 1);
  const format = params.coord_format ?? "decimal";
  const latMin = safeFiniteNumber(params.lat_min, -90);
  const latMax = safeFiniteNumber(params.lat_max, 90);
  const lngMin = safeFiniteNumber(params.lng_min, -180);
  const lngMax = safeFiniteNumber(params.lng_max, 180);

  const [minLat, maxLat] =
    latMin <= latMax ? [latMin, latMax] : [latMax, latMin];
  const [minLng, maxLng] =
    lngMin <= lngMax ? [lngMin, lngMax] : [lngMax, lngMin];

  const toDMS = (decimal: number, isLat: boolean): string => {
    const dir = isLat ? (decimal >= 0 ? "N" : "S") : decimal >= 0 ? "E" : "W";
    const abs = Math.abs(decimal);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = Math.round(((abs - deg) * 60 - min) * 60 * 100) / 100;
    return "" + deg + "°" + min + "'" + sec.toFixed(2) + '"' + dir;
  };

  const generateOneCoords = (): string => {
    const lat =
      minLat +
      (maxLat - minLat) * (randomIntInclusive(0, 1_000_000) / 1_000_000);
    const lng =
      minLng +
      (maxLng - minLng) * (randomIntInclusive(0, 1_000_000) / 1_000_000);

    switch (format) {
      case "dms":
        return toDMS(lat, true) + ", " + toDMS(lng, false);
      case "decimal":
      default:
        return lat.toFixed(6) + ", " + lng.toFixed(6);
    }
  };

  const values = Array.from({ length: count }, generateOneCoords);
  const meta = {
    latRange: [minLat, maxLat],
    lngRange: [minLng, maxLng],
    format,
  };
  return { values, meta };
}

export function generateIPv4(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("ipv4");
  const count = clampInt(params.count, 1, 10_000, 1);
  const includePrivate = Boolean(params.ipv4_private);
  const includeReserved = Boolean(params.ipv4_reserved);

  const isPrivate = (a: number, b: number): boolean => {
    return (
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254)
    );
  };

  const isReserved = (a: number): boolean => {
    return a === 0 || a === 127 || a >= 224;
  };

  const generateOneIP = (): string => {
    let a: number, b: number, c: number, d: number;
    let attempts = 0;

    do {
      a = randomIntInclusive(1, 223);
      b = randomIntInclusive(0, 255);
      c = randomIntInclusive(0, 255);
      d = randomIntInclusive(1, 254);
      attempts++;
    } while (
      attempts < 100 &&
      ((!includePrivate && isPrivate(a, b)) ||
        (!includeReserved && isReserved(a)))
    );

    return "" + a + "." + b + "." + c + "." + d;
  };

  const values = Array.from({ length: count }, generateOneIP);
  const meta = { includePrivate, includeReserved };
  return { values, meta };
}

export function generateMAC(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("mac");
  const count = clampInt(params.count, 1, 10_000, 1);
  const separator = params.mac_separator ?? ":";
  const upperCase = params.mac_case !== "lower";

  const generateOneMAC = (): string => {
    const hex = upperCase ? "0123456789ABCDEF" : "0123456789abcdef";
    let result = "";
    for (let i = 0; i < 6; i++) {
      if (i > 0 && separator) result += separator;
      result += hex[randomIntInclusive(0, 15)];
      result += hex[randomIntInclusive(0, 15)];
    }
    return result;
  };

  const values = Array.from({ length: count }, generateOneMAC);
  const meta = { separator, case: upperCase ? "upper" : "lower" };
  return { values, meta };
}

export function generateBytes(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("bytes");
  const count = clampInt(params.count, 1, 1000, 1);
  const length = clampInt(params.bytes_length, 1, 1048576, 16);
  const format = params.bytes_format ?? "base64";

  const generateOneBytes = (): string => {
    const arr = new Uint8Array(length);
    const crypto = getCryptoOptional();
    if (crypto) {
      crypto.getRandomValues(arr);
    } else {
      for (let i = 0; i < length; i++) arr[i] = randomIntInclusive(0, 255);
    }

    switch (format) {
      case "hex": {
        const hex = "0123456789ABCDEF";
        let result = "";
        for (let i = 0; i < length; i++) {
          const b = arr[i]!;
          result += hex[(b >> 4) & 0xf] + hex[b & 0xf];
        }
        return result;
      }
      case "array":
        return "[" + Array.from(arr).join(", ") + "]";
      case "base64":
      default: {
        if (typeof btoa === "function") {
          const binary = Array.from(arr, (b) => String.fromCharCode(b)).join(
            "",
          );
          return btoa(binary);
        }
        return Buffer.from(arr).toString("base64");
      }
    }
  };

  const values = Array.from({ length: count }, generateOneBytes);
  const meta = { length, format };
  return { values, meta };
}
