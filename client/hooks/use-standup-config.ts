import { configChannelStandup } from "@/api/slack";
import { TConfigChannelStandup } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";

export const useStandupConfig = () => {
  return useMutation({
    mutationFn: async (data: TConfigChannelStandup) =>
      await configChannelStandup(data),
  });
};
