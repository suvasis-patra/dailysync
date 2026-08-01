"use client";
import OAuthError from "@/components/oauth-error";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const OAuthStatus = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oauth = searchParams.get("oauth");
  const workspaceId = searchParams.get("workspaceId");
  const message = searchParams.get("message");
  if (!oauth) {
    return (
      <div>
        <p>Something went wrong. Slack connection failed.</p>
        <Button>Try again</Button>
      </div>
    );
  }
  if (oauth === "error") {
    return <OAuthError message={message} />;
  }
  if (oauth === "success") {
    if (!workspaceId) {
      return <OAuthError message={"workspace id missing"} />;
    }
    router.push(`configuration/${workspaceId}`);
  }
};

export default OAuthStatus;
