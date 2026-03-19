"use client";

import { useUserSync } from "@/hooks/useUserSync";

export default function Page() {
  const { isPending } = useUserSync();

  if (isPending) return <div>Setting up your account...</div>;

  return <div>Dashboard Ready 🚀</div>;
}