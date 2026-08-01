import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TChannel } from "./index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformChannelsToOptions(channels: any[]): TChannel[] {
  return channels.map((channel) => ({
    label: `#${channel.name}`,
    value: channel.slackChannelId,
  }));
}
