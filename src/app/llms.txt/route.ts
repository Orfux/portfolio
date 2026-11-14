import { getPosts, getProjects } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import { otherSites, site } from "@/lib/site";

/*
 * /llms.txt — yapay zekâ araçları için sitenin özet haritası (llmstxt.org).
 * İçerik projeler ve yazılar eklendikçe otomatik güncellenir.
 */
async function buildLlmsTxt() {
  "use cache";
  const [projectsEn, postsEn, projectsTr, postsTr] = await Promise.all([
    getProjects("en"),
    getPosts("en"),
    getProjects("tr"),
    getPosts("tr"),
  ]);

  const list = (items: { title: string; summary: string; slug: string }[], base: string) =>
    items.map((i) => `- [${i.title}](${absUrl(`${base}/${i.slug}`)}): ${i.summary}`).join("\n");

  return `# ${site.name}

> ${site.name} is an electrical & electronics engineer based in Aydın, Türkiye, working on industrial automation (PLC programming, HMI/SCADA, electrical panel design), energy systems (biogas power generation, EMS, BESS, solar) and AI/computer vision projects. The site is available in English (/en) and Turkish (/tr).

- Current role: Biogas power plant operator at Eko-En Enerji (Kuşadası), since 05/2026
- Previous: Automation engineer intern at EYS Makina (2025–2026); automation/electrical intern at Vertisa Environmental Technologies (2023, 2024)
- Education: Electrical & Electronics Engineering, Kütahya Dumlupınar University (2021–2026)
- Tools: Siemens TIA Portal, Delta ISPSoft/WPLSoft/DOPSoft, Mitsubishi GX Works2, CODESYS, EPLAN, AutoCAD, Modbus, Python
- Contact: ${site.links.email} · LinkedIn: ${site.links.linkedin} · GitHub: ${site.links.github}

## Pages

- [About](${absUrl("/en/about")}): Experience, skills, education and interests
- [Projects](${absUrl("/en/projects")}): Automation, energy, AI and web projects
- [Posts](${absUrl("/en/blog")}): Technical notes on automation, energy and AI
- [Sites](${absUrl("/en/sites")}): Other live websites

## Projects

${list(projectsEn, "/en/projects")}

## Posts

${list(postsEn, "/en/blog")}

## Other sites

${otherSites.map((s) => `- [${s.name}](${s.url}): ${s.description.en}`).join("\n")}

## Türkçe

- [Hakkımda](${absUrl("/tr/about")})
${list(projectsTr, "/tr/projects")}
${list(postsTr, "/tr/blog")}
`;
}

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
