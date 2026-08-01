"use client";
import { useEffect } from "react";
import OAuthError from "@/components/oauth-error";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

const OAuthStatus = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oauth = searchParams.get("oauth");
  const workspaceId = searchParams.get("workspaceId");
  const message = searchParams.get("message");

  useEffect(() => {
    if (oauth === "success" && workspaceId) {
      router.push(`/configuration/${workspaceId}`);
    }
  }, [oauth, workspaceId, router]);

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

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p>Redirecting to configuration...</p>
      </div>
    );
  }

  return null;
};

export default OAuthStatus;
