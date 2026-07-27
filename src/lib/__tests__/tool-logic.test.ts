import { describe, expect, it } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  parseRgb,
  parseUnixTime,
  parseHumanDate,
  sanitizeFlags,
  runRegex,
  optimizeSvg,
} from "../tool-logic";
import { minifyJs } from "@/tools/js/JsMinifier";

describe("hex / rgb conversion", () => {
  it("expands 3-digit hex", () => {
    expect(hexToRgb("#0f8")).toEqual({ r: 0, g: 255, b: 136 });
  });
  it("parses 6-digit hex with and without hash", () => {
    expect(hexToRgb("#22C55E")).toEqual({ r: 34, g: 197, b: 94 });
    expect(hexToRgb("22c55e")).toEqual({ r: 34, g: 197, b: 94 });
  });
  it("rejects invalid hex", () => {
    expect(hexToRgb("#12345")).toBeNull();
    expect(hexToRgb("zzzzzz")).toBeNull();
    expect(hexToRgb("")).toBeNull();
  });
  it("round-trips rgb -> hex -> rgb", () => {
    expect(rgbToHex(34, 197, 94)).toBe("#22C55E");
    expect(hexToRgb(rgbToHex(1, 2, 3))).toEqual({ r: 1, g: 2, b: 3 });
  });
  it("clamps out-of-range channels when formatting", () => {
    expect(rgbToHex(-20, 300, 128)).toBe("#00FF80");
  });
  it("parses rgb strings and rejects out-of-range values", () => {
    expect(parseRgb("rgb(34, 197, 94)")).toEqual({ r: 34, g: 197, b: 94 });
    expect(parseRgb("34 197")).toBeNull();
    expect(parseRgb("300, 0, 0")).toBeNull();
  });
});

describe("unix time parsing", () => {
  it("treats 10-digit input as seconds in auto mode", () => {
    expect(parseUnixTime("1700000000").date?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });
  it("treats 13-digit input as milliseconds in auto mode", () => {
    expect(parseUnixTime("1700000000000").date?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });
  it("honours explicit units", () => {
    expect(parseUnixTime("1000", "ms").date?.getTime()).toBe(1000);
    expect(parseUnixTime("1000", "s").date?.getTime()).toBe(1_000_000);
  });
  it("returns no error for empty input", () => {
    expect(parseUnixTime("")).toEqual({ date: null, error: null });
  });
  it("rejects non-numeric and out-of-range input", () => {
    expect(parseUnixTime("12ab").error).toMatch(/whole numbers/i);
    expect(parseUnixTime("999999999999999999").error).toBeTruthy();
  });
  it("parses human dates and flags bad ones", () => {
    expect(parseHumanDate("2024-01-31T00:00:00Z").date?.getUTCFullYear()).toBe(2024);
    expect(parseHumanDate("not a date").error).toMatch(/unrecognised/i);
  });
});

describe("regex tester logic", () => {
  it("drops invalid and duplicate flags", () => {
    expect(sanitizeFlags("ggimxz!")).toBe("gim");
  });
  it("finds all global matches", () => {
    const { matches, error } = runRegex("\\d+", "g", "a1 b22 c333");
    expect(error).toBeNull();
    expect(matches.map((m) => m.match)).toEqual(["1", "22", "333"]);
    expect(matches[1].index).toBe(4);
  });
  it("finds a single match without the g flag", () => {
    expect(runRegex("\\d+", "", "a1 b22").matches).toHaveLength(1);
  });
  it("captures groups", () => {
    expect(runRegex("(\\w+)@(\\w+)", "", "me@here").matches[0].groups).toEqual(["me", "here"]);
  });
  it("reports invalid patterns instead of throwing", () => {
    const res = runRegex("(unclosed", "g", "x");
    expect(res.error).toBeTruthy();
    expect(res.matches).toEqual([]);
  });
});

describe("js minifier", () => {
  it("strips comments", () => {
    expect(minifyJs("// hi\nvar a=1; /* block */ var b=2;")).toBe("var a=1;var b=2;");
  });
  it("preserves string contents", () => {
    expect(minifyJs('var s = "a // b";')).toBe('var s="a // b";');
  });
  it("keeps required whitespace between keywords", () => {
    expect(minifyJs("const  x  =  1")).toBe("const x=1");
  });
  it("throws on an unterminated block comment", () => {
    expect(() => minifyJs("/* nope")).toThrow(/unterminated/i);
  });
});

describe("svg optimizer", () => {
  it("removes comments and metadata", () => {
    const out = optimizeSvg('<svg xmlns="http://www.w3.org/2000/svg"><!-- c --><title>t</title><rect /></svg>');
    expect(out).not.toContain("<!--");
    expect(out).not.toContain("<title>");
  });
  it("rounds long decimals", () => {
    expect(optimizeSvg('<svg viewBox="0 0 1.23456 2"></svg>')).toContain("1.23");
  });
  it("rejects non-svg input", () => {
    expect(() => optimizeSvg("<div></div>")).toThrow(/svg/i);
    expect(() => optimizeSvg("")).toThrow();
  });
});
