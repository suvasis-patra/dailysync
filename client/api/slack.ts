import { axiosInstance } from "@/lib/api";
import { TConfigChannelStandup } from "@/lib/schema";

export const initiateSlackAuth = () => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
  window.location.href = `${backendUrl}/slack/auth`;
};

export const getWorkspaceChannels = async (workspaceId: string) => {
  try {
    const res = await axiosInstance.get(`/channel/${workspaceId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const configChannelStandup = async (data: TConfigChannelStandup) => {
  try {
    const res = await axiosInstance.post("/config/", data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
