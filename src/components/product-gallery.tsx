"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CatalogImage } from "@/lib/catalog";

// Below lg: a full-bleed, swipeable carousel with position dots.
// From lg: the same slides become a large editorial grid (hero view first,
// close-ups paired beneath), so there is one set of images in the DOM.
export function ProductGallery({ images }: { images: CatalogImage[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  function show(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  return (
    <section aria-label="Product images" className="relative">
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:gap-tile lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => {
          const isLead = index === 0;
          const zoom = image.zoom ?? 1;
          return (
            <li
              key={`${image.src}-${index}`}
              className={`w-full shrink-0 snap-start lg:w-auto ${isLead ? "lg:col-span-2" : ""}`}
              aria-label={`Image ${index + 1} of ${images.length}`}
            >
              <div className="media-frame">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading={isLead ? "eager" : "lazy"}
                  fetchPriority={isLead ? "high" : undefined}
                  // Close-ups are magnified, so request proportionally more pixels.
                  sizes={
                    isLead
                      ? "(min-width: 64rem) 60vw, 100vw"
                      : `(min-width: 64rem) ${Math.round(30 * zoom)}vw, ${Math.round(100 * zoom)}vw`
                  }
                  style={{
                    objectPosition: image.position,
                    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                    transformOrigin: image.position,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {images.length > 1 ? (
        <div className="flex items-center justify-between px-gutter pt-3 lg:hidden">
          <p className="price text-micro text-muted" aria-live="polite">
            {active + 1} / {images.length}
          </p>
          <div className="flex">
            {images.map((image, index) => (
              <button
                key={`${image.src}-dot-${index}`}
                type="button"
                className="group flex size-8 items-center justify-center"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === active}
                onClick={() => show(index)}
              >
                <span
                  className={`block h-0.5 w-5 transition-colors ${index === active ? "bg-ink" : "bg-line group-hover:bg-subtle"}`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
