import { axiosInstance } from "@/lib/api";

export const initiateSlackAuth = async () => {
  try {
    const response = await axiosInstance.get("/slack/auth");
    console.log(response.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
