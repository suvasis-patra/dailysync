"use client";
import ConfigForm from "@/components/config-form";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const workspaceId = params?.workspaceId;
  if (!workspaceId) {
    return null;
  }
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Configure your team's standup
          </h1>

          <p className="mt-4 text-muted-foreground text-lg">
            Set it once. Daily Sync will automatically collect updates every
            day.
          </p>
        </div>

        <ConfigForm workspaceId={workspaceId as string} />
      </div>
    </main>
  );
}
