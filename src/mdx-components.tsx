import type { MDXComponents } from "mdx/types";

// MDX içindeki HTML öğeleri için ortak bileşenler.
// Stil çoğunlukla sayfalardaki `prose` sınıfından gelir.
const components: MDXComponents = {
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      />
    );
  },
  // eslint-disable-next-line @next/next/no-img-element
  img: (props) => <img {...props} alt={props.alt ?? ""} className="rounded-lg border border-zinc-200 dark:border-zinc-800" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
