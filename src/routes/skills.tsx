import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/skills")({
  beforeLoad: () => {
    throw redirect({ to: "/pl/umiejetnosci", statusCode: 301 });
  },
});
