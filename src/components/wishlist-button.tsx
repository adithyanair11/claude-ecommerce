"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/icons";

export function WishlistButton({
  productName,
  className = "btn btn-ghost btn-icon btn-sm",
}: {
  productName: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={`Save ${productName} to wishlist`}
      onClick={() => setSaved((value) => !value)}
    >
      <HeartIcon filled={saved} width={18} height={18} />
    </button>
  );
}
