import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">FRiNGE</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tighter">
        {session_id ? "You're in. 🤙" : "No session found"}
      </h1>
      <p className="mt-4 text-foreground/60">
        {session_id
          ? "Your access is unlocking right now. If anything looks off, refresh in a few seconds."
          : "We couldn't find a checkout session. Head back and try again."}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
      >
        Back to the Living Globe →
      </Link>
    </section>
  );
}
