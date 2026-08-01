import { getWorkspaceChannels } from "@/api/slack";
import { useQuery } from "@tanstack/react-query";

export const useGetChannels = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery({
    queryKey: ["channels", workspaceId],
    enabled: Boolean(workspaceId),
    queryFn: async () => await getWorkspaceChannels(workspaceId),
  });
};
