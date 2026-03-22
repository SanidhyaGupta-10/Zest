"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group"
    >
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
        <ArrowLeft className="size-4" />
      </div>
      <span className="uppercase tracking-wider text-[11px] font-black">
        {label}
      </span>
    </button>
  );
}
