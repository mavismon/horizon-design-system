import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  item1?: string;
  item2?: string;
  item3?: string;
  current?: string;
  showItem2?: boolean;
  showItem3?: boolean;
  item1Href?: string;
  item2Href?: string;
  item3Href?: string;
}

export function Breadcrumbs({
  item1 = "Stays",
  item2 = "Portugal",
  item3 = "Lisbon",
  current = "Alfama",
  showItem2 = true,
  showItem3 = true,
  item1Href,
  item2Href,
  item3Href,
  className,
  ...rest
}: BreadcrumbsProps) {
  const ancestors = [
    { label: item1, href: item1Href, show: true },
    { label: item2, href: item2Href, show: showItem2 },
    { label: item3, href: item3Href, show: showItem3 },
  ].filter((a) => a.show);

  return (
    <nav aria-label="Breadcrumb" className={cn("hz-breadcrumbs", className)} {...rest}>
      <ol className="hz-breadcrumbs__list">
        {ancestors.map((a, i) => (
          <li key={i} className="hz-breadcrumbs__item">
            <a className="hz-breadcrumbs__link" href={a.href}>
              {a.label}
            </a>
            <span className="hz-breadcrumbs__separator" aria-hidden="true">
              /
            </span>
          </li>
        ))}
        <li className="hz-breadcrumbs__item">
          <span className="hz-breadcrumbs__current" aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
