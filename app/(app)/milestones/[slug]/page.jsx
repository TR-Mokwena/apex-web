import MilestoneDetail from "./MilestoneDetail";
import { MILESTONES } from "@/lib/milestones";

export function generateStaticParams() {
  return MILESTONES.map((m) => ({ slug: m.slug }));
}

export default async function MilestonePage({ params }) {
  const { slug } = await params;
  return <MilestoneDetail slug={slug} />;
}
