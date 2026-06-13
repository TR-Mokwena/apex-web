import { cn } from "@/lib/cn";
import Icon from "@/components/Icon";

/**
 * The standard white card (mockup `.card .card-pad`). Optional header row with
 * a title and a right-side `action` node.
 */
export function Card({ title, action, children, className, pad = true }) {
  return (
    <section className={cn("card", pad && "p-[18px]", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between mb-4">
          {title ? <h3 className="m-0 text-[15px] font-semibold text-heading">{title}</h3> : <span />}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** "View all →" affordance: arrow nudges on hover. */
export function CardLink({ children, href, onClick, className }) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-1 text-[12.5px] font-medium text-brand cursor-pointer transition-[gap,color] hover:gap-2 hover:text-brand-600",
        className,
      )}
    >
      {children}
      <Icon name="ArrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" />
    </Comp>
  );
}
