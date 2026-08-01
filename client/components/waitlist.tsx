import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2, Check } from "lucide-react";

interface WaitlistFormProps {
  variant?: "dark" | "light";
  source?: string;
  testid?: string;
}

export default function WaitlistForm({
  variant = "dark",
  source = "landing",
  testid = "waitlist",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const dark = variant === "dark";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      setStatus("done");
      toast.success("You're on the list. We'll be in touch soon.");

      setEmail("");

      setTimeout(() => {
        setStatus("idle");
      }, 2600);
    } catch {
      setStatus("idle");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid={`${testid}-form`}
      className={`flex w-full max-w-md items-center gap-2 rounded-full border p-1.5 ${
        dark
          ? "border-white/15 bg-white/3"
          : "border-black/10 bg-white shadow-sm"
      }`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        data-testid={`${testid}-email-input`}
        className={`min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-neutral-500 ${
          dark ? "text-white" : "text-neutral-900"
        }`}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        data-testid={`${testid}-submit-btn`}
        className="volt-glow inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#b3e600] disabled:opacity-70"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "done" ? (
          <>
            Added
            <Check className="h-4 w-4" />
          </>
        ) : (
          <>
            Get early access
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
