import { z } from "zod";

// Strict HEX color regex (#RGB, #RRGGBB, #RRGGBBAA)
export const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function normalizeHexColor(hex: string): string {
  if (!hex || typeof hex !== "string") return "#531B23";
  let cleaned = hex.trim().toUpperCase();
  if (!cleaned.startsWith("#")) {
    cleaned = "#" + cleaned;
  }
  // Convert 3-char hex to 6-char hex
  if (cleaned.length === 4) {
    cleaned =
      "#" +
      cleaned[1] +
      cleaned[1] +
      cleaned[2] +
      cleaned[2] +
      cleaned[3] +
      cleaned[3];
  }
  return cleaned;
}

export const GradientStopSchema = z.object({
  color: z.string().regex(HEX_COLOR_REGEX, "لون التدرج غير صالح"),
  offset: z.number().min(0).max(100),
});

export const GradientConfigSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(["linear", "radial"]),
  angle: z.number().min(0).max(360),
  stops: z.array(GradientStopSchema).min(2).max(10),
});

export const PartColorConfigSchema = z.object({
  color: z.string().regex(HEX_COLOR_REGEX, "رمز اللون غير صالح"),
  gradient: GradientConfigSchema.optional(),
});

export const BackgroundConfigSchema = z.object({
  type: z.enum(["transparent", "solid", "gradient"]),
  color: z.string().regex(HEX_COLOR_REGEX, "لون الخلفية غير صالح").optional(),
  gradient: GradientConfigSchema.optional(),
});

export const ProposalDesignSchema = z.object({
  logoVersion: z.string().min(1),
  background: BackgroundConfigSchema,
  parts: z.object({
    symbol_y: PartColorConfigSchema,
    symbol_e: PartColorConfigSchema,
    symbol_u: PartColorConfigSchema,
    symbol_squares: PartColorConfigSchema,
    text_arabic: PartColorConfigSchema,
    text_english: PartColorConfigSchema,
  }),
});

export const CreateProposalInputSchema = z.object({
  design: ProposalDesignSchema,
});

export const CreateCommentInputSchema = z.object({
  userName: z
    .string()
    .trim()
    .max(50, "الاسم طويل جداً")
    .optional()
    .transform((val) => val || "مشارك"),
  content: z
    .string()
    .trim()
    .min(2, "التعليق قصير جداً")
    .max(500, "يجب ألا يتجاوز التعليق 500 حرف"),
});

export const AdminLoginInputSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type ProposalDesignInput = z.infer<typeof ProposalDesignSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginInputSchema>;
