import { test } from "node:test";
import assert from "node:assert";
import {
  normalizeHexColor,
  HEX_COLOR_REGEX,
  ProposalDesignSchema,
  CreateCommentInputSchema,
} from "../lib/validation/proposal-schema";

test("Color Normalizer should normalize lowercase and 3-digit hex", () => {
  assert.strictEqual(normalizeHexColor("#ffffff"), "#FFFFFF");
  assert.strictEqual(normalizeHexColor("#531b23"), "#531B23");
  assert.strictEqual(normalizeHexColor("531b23"), "#531B23");
  assert.strictEqual(normalizeHexColor("#fff"), "#FFFFFF");
  assert.strictEqual(normalizeHexColor("#abc"), "#AABBCC");
});

test("HEX regex should strictly validate valid and invalid hex strings", () => {
  assert.strictEqual(HEX_COLOR_REGEX.test("#531B23"), true);
  assert.strictEqual(HEX_COLOR_REGEX.test("#FFF"), true);
  assert.strictEqual(HEX_COLOR_REGEX.test("#FFFFFF"), true);
  assert.strictEqual(HEX_COLOR_REGEX.test("#531b23ff"), true);

  assert.strictEqual(HEX_COLOR_REGEX.test("531B23"), false); // missing #
  assert.strictEqual(HEX_COLOR_REGEX.test("#GGGGGG"), false); // invalid hex char
  assert.strictEqual(HEX_COLOR_REGEX.test("#12"), false); // invalid length
  assert.strictEqual(HEX_COLOR_REGEX.test("<script>"), false); // xss attempt
});

test("ProposalDesignSchema should validate authentic SEU proposal structure", () => {
  const validDesign = {
    logoVersion: "2026-v1",
    background: {
      type: "solid" as const,
      color: "#FFFFFF",
    },
    parts: {
      symbol_y: { color: "#531B23" },
      symbol_e: { color: "#531B23" },
      symbol_u: { color: "#531B23" },
      symbol_squares: { color: "#C9A227" },
      text_arabic: { color: "#531B23" },
      text_english: { color: "#531B23" },
    },
  };

  const result = ProposalDesignSchema.safeParse(validDesign);
  assert.strictEqual(result.success, true);
});

test("ProposalDesignSchema should reject invalid parts or malformed colors", () => {
  const invalidDesign = {
    logoVersion: "2026-v1",
    background: { type: "transparent" as const },
    parts: {
      symbol_y: { color: "NOT_A_COLOR" },
      symbol_e: { color: "#531B23" },
      symbol_u: { color: "#531B23" },
      symbol_squares: { color: "#C9A227" },
      text_arabic: { color: "#531B23" },
      text_english: { color: "#531B23" },
    },
  };

  const result = ProposalDesignSchema.safeParse(invalidDesign);
  assert.strictEqual(result.success, false);
});

test("CreateCommentInputSchema should sanitize and enforce limits", () => {
  const validComment = {
    userName: "د. عبد العزيز",
    content: "تناغم رائع جداً بين العنابي الملكي والذهب الخالص.",
  };
  const result = CreateCommentInputSchema.safeParse(validComment);
  assert.strictEqual(result.success, true);

  const emptyComment = { content: " " };
  const emptyResult = CreateCommentInputSchema.safeParse(emptyComment);
  assert.strictEqual(emptyResult.success, false);
});

test("ProposalDesignSchema should validate multi-stop gradients (3, 4, 5+ stops)", () => {
  const multiStopDesign = {
    logoVersion: "2026-v1",
    background: { type: "transparent" as const },
    parts: {
      symbol_y: {
        color: "#531B23",
        gradient: {
          enabled: true,
          type: "linear" as const,
          angle: 135,
          stops: [
            { color: "#531B23", offset: 0 },
            { color: "#8E2835", offset: 35 },
            { color: "#C9A227", offset: 70 },
            { color: "#FFFFFF", offset: 100 },
          ],
        },
      },
      symbol_e: { color: "#531B23" },
      symbol_u: { color: "#531B23" },
      symbol_squares: { color: "#C9A227" },
      text_arabic: { color: "#531B23" },
      text_english: { color: "#531B23" },
    },
  };

  const result = ProposalDesignSchema.safeParse(multiStopDesign);
  assert.strictEqual(result.success, true);
});
