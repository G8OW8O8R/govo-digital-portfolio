import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/process")({
  beforeLoad: () => {
    throw redirect({ to: "/pl/proces", statusCode: 301 });
  },
});
