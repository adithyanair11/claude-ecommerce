import type { StockStatus } from "@/lib/catalog";

const tone: Record<StockStatus, string> = {
  "in-stock": "bg-success",
  "low-stock": "bg-warning",
  "sold-out": "bg-subtle",
};

export function stockLabel(status: StockStatus, units: number) {
  if (status === "sold-out") return "Sold out";
  if (status === "low-stock") return `Only ${units} left`;
  return "In stock";
}

export function StockIndicator({
  status,
  units,
  note,
}: {
  status: StockStatus;
  units: number;
  /** Extra context, e.g. "in size M". */
  note?: string;
}) {
  return (
    <p className="flex items-center gap-2 text-small">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${tone[status]}`} />
      <span className={status === "low-stock" ? "text-warning" : undefined}>
        {stockLabel(status, units)}
        {note ? ` ${note}` : null}
      </span>
    </p>
  );
}
