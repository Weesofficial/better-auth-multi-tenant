import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <h1>better-auth-multi-tenant on TanStack Start</h1>,
});
