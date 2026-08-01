import { z } from "zod";

export const ZStandupQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question cannot exceed 200 characters"),
});

export const ZSetupSchema = z.object({
  channelId: z.string().min(1, "Please select a standup channel"),

  timezone: z.string().min(1, "Please select a timezone"),

  standupTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Please select a valid time"),

  reminderMinutes: z.number().int().nonnegative().nullable(),

  questions: z
    .array(ZStandupQuestionSchema)
    .min(3, "At least 3 standup questions are required")
    .max(10, "Maximum 10 questions are allowed"),
});

export type TSetupFormValues = z.infer<typeof ZSetupSchema>;

export type TConfigChannelStandup = Omit<TSetupFormValues, "standupTime"> & {
  workspaceId: string;
  standupHour: number;
  standupMinute: number;
};
