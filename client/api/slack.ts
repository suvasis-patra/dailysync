export const initiateSlackAuth = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
  window.location.href = `${backendUrl}/slack/auth`;
};
