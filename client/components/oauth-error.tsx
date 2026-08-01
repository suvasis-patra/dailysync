import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const OAuthError = ({ message }: { message: string | null }) => {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-semibold">Slack connection failed</h1>

        <p className="mt-3 text-muted-foreground">
          {message ||
            "We couldn't connect your Slack workspace. Please try again."}
        </p>

        <button
          type="button"
          onClick={() => router.replace("/")}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#ccff00] px-6 font-medium text-black transition hover:bg-[#d9ff2f]"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default OAuthError;
