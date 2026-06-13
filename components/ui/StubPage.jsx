import { PageHeader } from "./PageHeader";
import { Card } from "./Card";
import Icon from "@/components/Icon";

/** Placeholder for routes not yet ported from the v1 mockups. */
export function StubPage({ title, subtitle, icon = "Hammer", mockup }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="grid place-items-center text-center min-h-[360px]">
        <div className="flex flex-col items-center gap-3 max-w-[420px]">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-soft text-brand">
            <Icon name={icon} size={26} />
          </span>
          <h3 className="m-0 text-lg font-semibold text-heading">Coming together next</h3>
          <p className="m-0 text-[13.5px] text-ink-2 leading-relaxed">
            This screen is being ported from the design mockups.
            {mockup && <> Source: <code className="text-brand">legacy/{mockup}</code>.</>}
          </p>
        </div>
      </Card>
    </>
  );
}
