import EmployeeProfile from "./EmployeeProfile";
import { TEAM } from "@/lib/team";

export function generateStaticParams() {
  return TEAM.map((p) => ({ slug: p.slug }));
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  return <EmployeeProfile slug={slug} />;
}
