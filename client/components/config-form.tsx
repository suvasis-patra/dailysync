"use client";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock3,
  MessageSquareText,
  Bell,
  Hash,
  Plus,
  Trash2,
  Globe2,
  Lock,
  Loader2,
} from "lucide-react";

import { TSetupFormValues, ZSetupSchema } from "@/lib/schema";
import { SectionHeader } from "./section-header";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formControlClassName, TIME_ZONES } from "@/lib/constants";
import { TChannel } from "@/lib";
import { ItemTitle } from "./ui/item";
import { useGetChannels } from "@/hooks/use-get-channels";
import { transformChannelsToOptions } from "@/lib/utils";
import { useMemo } from "react";
import { useStandupConfig } from "@/hooks/use-standup-config";

const reminderOptions = [
  { label: "No reminder", value: null },
  { label: "5 minutes before", value: 5 },
  { label: "10 minutes before", value: 10 },
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
  { label: "60 minutes before", value: 60 },
];

export default function ConfigForm({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading } = useGetChannels({ workspaceId });
  const { mutateAsync: configStandup } = useStandupConfig();
  const channels = useMemo(
    () => transformChannelsToOptions(data?.data ?? []),
    [data?.data],
  );
  console.log(data);
  const form = useForm<TSetupFormValues>({
    resolver: zodResolver(ZSetupSchema),
    defaultValues: {
      channelId: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      standupTime: "09:30",
      reminderMinutes: 30,
      questions: [
        {
          question: "What did you work on yesterday?",
        },
        {
          question: "What will you work on today?",
        },
        {
          question: "Any blockers?",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (values: TSetupFormValues) => {
    const [standupHour, standupMinute] = values.standupTime
      .split(":")
      .map(Number);

    const payload = {
      channelId: values.channelId,
      timezone: values.timezone,
      standupHour,
      standupMinute,
      reminderMinutes: values.reminderMinutes,
      questions: values.questions.map((q, index) => ({
        question: q.question,
        order: index + 1,
      })),
    };

    console.log(payload);

    const res = await configStandup({ ...payload, workspaceId });
    console.log(res);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Workspace */}

      <div className="rounded-[28px] border border-white/10 bg-white/3 p-8 backdrop-blur-xl shadow-2xl">
        <SectionHeader
          title="Workspace Settings"
          description="Configure when and where Daily Sync posts your standups."
        />

        <FieldGroup className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Channel */}

          <Controller
            control={form.control}
            name="channelId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-200">
                  <Hash className="h-4 w-4 text-[#ccff00]" />
                  Standup Channel
                </FieldLabel>

                <Combobox
                  items={channels}
                  itemToStringValue={(channel: TChannel) => channel.label}
                  onValueChange={(value) => field.onChange(value?.value ?? "")}
                >
                  <ComboboxInput
                    placeholder="Search a channel..."
                    className={formControlClassName}
                  />
                  <ComboboxContent>
                    {isLoading ? (
                      <div className="p-3 text-sm text-muted-foreground flex flex-col gap-1 items-center justify-center">
                        <Loader2 className="animate-spin" />
                        <p className="text-center">Loading...</p>
                      </div>
                    ) : (
                      <>
                        <ComboboxEmpty>No items found</ComboboxEmpty>
                        <ComboboxList>
                          {(item: TChannel) => (
                            <ComboboxItem key={item.value} value={item}>
                              <ItemTitle className="whitespace-nowrap">
                                {item.label}
                              </ItemTitle>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </>
                    )}
                  </ComboboxContent>
                </Combobox>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Timezone */}

          <Controller
            control={form.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-200">
                  <Globe2 className="h-4 w-4 text-[#ccff00]" />
                  Timezone
                </FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className={formControlClassName}>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {TIME_ZONES.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Standup Time */}

          <Field>
            <FieldLabel className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-200">
              <Clock3 className="h-4 w-4 text-[#ccff00]" />
              Standup Time
            </FieldLabel>

            <Input
              type="time"
              {...form.register("standupTime")}
              className={formControlClassName}
            />

            <FieldError errors={[form.formState.errors.standupTime]} />
          </Field>

          {/* Reminder */}

          <Controller
            control={form.control}
            name="reminderMinutes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-200">
                  <Bell className="h-4 w-4 text-[#ccff00]" />
                  Reminder
                </FieldLabel>

                <Select
                  value={field.value === null ? "none" : String(field.value)}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : Number(value))
                  }
                >
                  <SelectTrigger className={formControlClassName}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {reminderOptions.map((option) => (
                        <SelectItem
                          key={String(option.value)}
                          value={
                            option.value === null
                              ? "none"
                              : String(option.value)
                          }
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Private Channel Notice */}

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#ccff00]/15 bg-linear-to-br from-[#ccff00]/6 to-white/2 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ccff00]/10">
                  <Lock className="h-5 w-5 text-[#ccff00]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Want to post to a private channel?
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-neutral-400">
                      Slack only lets apps discover private channels after they
                      have been invited.
                    </p>
                  </div>

                  <ol className="space-y-2 text-sm leading-6 text-neutral-300">
                    <li>
                      <span className="font-semibold text-[#ccff00]">1.</span>{" "}
                      Open your private Slack channel.
                    </li>

                    <li>
                      <span className="font-semibold text-[#ccff00]">2.</span>{" "}
                      Run{" "}
                      <code className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-white">
                        /invite @Daily Sync
                      </code>
                    </li>

                    <li>
                      <span className="font-semibold text-[#ccff00]">3.</span>{" "}
                      Refresh this page and the channel will appear in the
                      dropdown.
                    </li>
                  </ol>

                  <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-400">
                    <span className="font-medium text-[#ccff00]">Tip:</span>{" "}
                    Public channels are detected automatically. Only private
                    channels require inviting the bot first.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FieldGroup>
      </div>

      {/* Questions */}

      <div className="rounded-[28px] border border-white/10 bg-white/3 p-8 backdrop-blur-xl shadow-2xl">
        <SectionHeader
          title="Standup Questions"
          description="Customize the questions Daily Sync sends every morning."
        />

        <div className="mt-8 space-y-5">
          {fields.map((question, index) => (
            <Field key={question.id}>
              <FieldLabel className="flex items-center gap-2 text-neutral-300">
                <MessageSquareText className="h-4 w-4 text-[#ccff00]" />
                Question {index + 1}
              </FieldLabel>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter your standup question..."
                  {...form.register(`questions.${index}.question`)}
                  className={formControlClassName}
                />

                {fields.length > 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-12 w-12 rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FieldError
                errors={[form.formState.errors.questions?.[index]?.question]}
              />
            </Field>
          ))}

          {fields.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  question: "",
                })
              }
              className="mt-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          )}
        </div>
      </div>

      {/* Submit */}

      <Button
        type="submit"
        className="h-14 w-full rounded-2xl bg-[#ccff00] text-base font-semibold text-black transition-all hover:scale-[1.01] hover:bg-[#d9ff2f]"
      >
        Save Configuration
      </Button>
    </form>
  );
}
