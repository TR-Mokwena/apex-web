import ProjectWorkspace from "./ProjectWorkspace";
import { PROJECTS } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  return <ProjectWorkspace slug={slug} />;
}
