"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

/**
 * Real brand mark via the Simple Icons CDN (monochrome white, for use on the
 * brand-coloured tile). Falls back to the lucide `icon` if a logo is missing
 * (e.g. brands Simple Icons no longer ships) or the CDN is unreachable.
 */
export default function BrandLogo({ slug, icon, size = 22 }) {
  const [failed, setFailed] = useState(false);
  if (slug && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${slug}/white`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
      />
    );
  }
  return <Icon name={icon} size={size} className="text-white" />;
}
