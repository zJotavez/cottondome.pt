/**
 * Mapeia slugs estáticos ou dinâmicos para chaves internas de tradução e identificação.
 */
export const mapSlugToKey = (slug: string): string => {
  if (!slug) return "";
  const clean = slug.toLowerCase().trim();
  if (clean === "alarme-intrusao" || clean === "intrusao-sistemas-alarme") return "intrusao";
  if (clean === "controle-acesso" || clean === "controlo-de-acessos") return "acessos";
  if (clean === "ups-energia" || clean === "ups-sistemas-energia") return "ups";
  if (clean === "redes-estruturadas" || clean === "redes-network-solutions") return "redes";
  if (clean === "cctv-videovigilancia") return "cctv";
  if (clean === "detecao-de-incendio") return "incendio";
  if (clean === "portas-seguranca-portoes-seccionados") return "portas-portoes";
  if (clean === "serralharia-ferro-inox") return "serralharia";
  return clean;
};
