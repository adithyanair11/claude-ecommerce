import Link from "next/link";

export function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted">{eyebrow}</p>
        <h2 id={id} className="text-headline">
          {title}
        </h2>
      </div>
      {action ? (
        <Link href={action.href} className="link-cta shrink-0 max-sm:hidden">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
