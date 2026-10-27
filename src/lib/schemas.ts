import { z } from "zod";

export const InputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  context: z.string().trim().max(1200).default(""),
  completedActivityResults: z.array(z.string().trim().max(500)).max(5).default([]),
});

export const NextActionInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  activityTitle: z.string().trim().min(2).max(160),
  activityGuidance: z.string().trim().max(700).default(""),
  result: z.string().trim().min(2).max(500),
  ambitionBrief: z.string().trim().max(1000).default(""),
  planner: z
    .object({
      requirements: z.array(z.string().max(300)).max(6).default([]),
      resources: z.array(z.string().max(250)).max(6).default([]),
      uncertainties: z.array(z.string().max(250)).max(6).default([]),
      risks: z.array(z.string().max(250)).max(6).default([]),
      firstAction: z.string().max(400).default(""),
    })
    .optional(),
  previousSuggestion: z.string().trim().max(400).default(""),
  clarification: z.string().trim().max(1000).default(""),
});

export const NextActionResultSchema = z.object({
  category: z.enum(["progress", "clarify", "revise", "help"]),
  title: z.string().trim().min(4).max(120),
  recommendation: z.string().trim().min(10).max(400),
  rationale: z.string().trim().min(10).max(300),
  followUpQuestion: z.string().trim().max(500).optional(),
});

export const ClarificationInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  context: z.string().trim().max(1200).default(""),
  turns: z
    .array(
      z.object({
        role: z.enum(["assistant", "user"]),
        content: z.string().trim().min(1).max(1200),
      }),
    )
    .max(30)
    .default([]),
});

export const ClarificationResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("question"),
    question: z.string().trim().min(5).max(500),
    clarifiedBrief: z.string().max(1000).default(""),
  }),
  z.object({
    status: z.literal("ready"),
    question: z.string().max(500).default(""),
    clarifiedBrief: z.string().trim().min(20).max(1000),
  }),
]);

export const JourneyDraftSchema = z.object({
  summary: z.string().trim().min(20).max(500),
  planner: z.object({
    requirements: z.array(z.string().trim().min(8).max(300)).min(2).max(6),
    resources: z.array(z.string().trim().min(5).max(250)).min(1).max(6),
    uncertainties: z.array(z.string().trim().min(5).max(250)).min(1).max(6),
    risks: z.array(z.string().trim().min(5).max(250)).min(1).max(6),
    firstAction: z.string().trim().min(10).max(400),
  }),
  activities: z
    .array(
      z.object({
        title: z.string().trim().min(4).max(120),
        guidance: z.string().trim().min(20).max(700),
        why: z.string().trim().min(10).max(300),
        resultPrompt: z.string().trim().min(10).max(250),
        milestoneTitle: z.string().trim().min(4).max(120),
        milestoneDescription: z.string().trim().min(10).max(300),
      }),
    )
    .min(3)
    .max(5),
});

export type AIJourneyDraft = z.infer<typeof JourneyDraftSchema>;
export type AINextActionDraft = z.infer<typeof NextActionResultSchema>;
export type AmbitionClarificationResult = z.infer<typeof ClarificationResultSchema>;
export type ClarificationTurn = z.infer<typeof ClarificationInputSchema>["turns"][number];
