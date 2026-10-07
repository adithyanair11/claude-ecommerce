"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { StockIndicator } from "@/components/stock-indicator";
import { WishlistButton } from "@/components/wishlist-button";
import { stockStatus, type SizeOption } from "@/lib/catalog";

// Front-end only for now: there is no cart backend yet, so "Add to bag"
// confirms the selection without persisting it.
export function ProductPurchase({
  productName,
  sizes,
  stock = 0,
}: {
  productName: string;
  sizes?: SizeOption[];
  stock?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [needsSize, setNeedsSize] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const sizesRef = useRef<HTMLFieldSetElement>(null);
  const legendId = useId();
  const errorId = useId();

  const selectedSize = sizes?.find((size) => size.label === selected);
  const total = sizes ? sizes.reduce((sum, size) => sum + size.stock, 0) : stock;
  const units = selectedSize ? selectedSize.stock : total;
  const status = stockStatus(units);
  const soldOut = total === 0;

  function addToBag() {
    if (sizes && !selectedSize) {
      setNeedsSize(true);
      sizesRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    setAdded(selectedSize?.label ?? "one size");
  }

  return (
    <div className="flex flex-col gap-6">
      <StockIndicator
        status={status}
        units={units}
        note={selectedSize && status !== "sold-out" ? `in size ${selectedSize.label}` : undefined}
      />

      {sizes ? (
        <fieldset
          ref={sizesRef}
          aria-labelledby={legendId}
          aria-describedby={needsSize ? errorId : undefined}
          disabled={soldOut}
        >
          <div className="mb-3 flex items-baseline justify-between">
            <legend id={legendId} className="eyebrow">
              Size{selected ? <span className="text-muted">: {selected}</span> : null}
            </legend>
            <Link href="/size-guide" className="link text-small text-muted">
              Size guide
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2">
            {sizes.map((size) => {
              const unavailable = size.stock === 0;
              return (
                <label key={size.label} className="relative">
                  <input
                    type="radio"
                    name="size"
                    value={size.label}
                    disabled={unavailable}
                    checked={selected === size.label}
                    onChange={() => {
                      setSelected(size.label);
                      setNeedsSize(false);
                      setAdded(null);
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex h-12 cursor-pointer items-center justify-center border text-small transition-colors peer-checked:border-line-strong peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-disabled:cursor-not-allowed peer-disabled:text-subtle peer-disabled:line-through hover:border-line-strong peer-disabled:hover:border-line">
                    {size.label}
                  </span>
                  {unavailable ? <span className="sr-only">, sold out</span> : null}
                </label>
              );
            })}
          </div>
          {needsSize ? (
            <p id={errorId} role="alert" className="mt-3 text-small text-error">
              Please select a size.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-primary btn-lg flex-1"
          disabled={soldOut}
          onClick={addToBag}
        >
          {soldOut ? "Sold out" : added ? "Added to bag" : "Add to bag"}
        </button>
        <WishlistButton productName={productName} className="btn btn-secondary btn-lg btn-icon" />
      </div>

      <div aria-live="polite">
        {added ? (
          <p className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-small">
            <span>
              {productName}
              {added !== "one size" ? `, size ${added},` : ""} has been added to your bag.
            </span>
            <Link href="/bag" className="link-cta">
              View bag
            </Link>
          </p>
        ) : null}
      </div>

      {soldOut ? (
        <p className="text-small text-muted">
          This piece is currently unavailable.{" "}
          <Link href="/contact" className="link text-ink">
            Contact client services
          </Link>{" "}
          to be told when it returns.
        </p>
      ) : null}
    </div>
  );
}
