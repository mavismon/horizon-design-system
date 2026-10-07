import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Link } from "../Link/Link";
import { Logo } from "../Logo/Logo";

export type SideBarItemState = "default" | "hover";

export interface SideBarItem {
  /** Figma `_sidebar-item` label, edited from the layers. */
  label: string;
  /** Not a Figma property. Where the item goes. */
  href?: string;
  /** Figma state=active: the page the person is on. Marks the link aria-current="page". */
  current?: boolean;
  /** Figma state=default or hover. Hover is also drawn by :hover; this prop pins it for a specimen. */
  state?: SideBarItemState;
}

export interface SideBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Figma `Title` (default "HS Admin"). */
  title?: string;
  /** Figma `Organisation` (default "Casa do Bairro group"). */
  organisation?: string;
  /** Figma `Detail` (default "4 properties · Lisbon"). */
  detail?: string;
  /** Figma `ShowFooter` (default true). */
  showFooter?: boolean;
  /** Figma draws up to 12 nav items (_sidebar-item). Defaults to the 12 drawn, Dashboard current. */
  items?: SideBarItem[];
  /** Not a Figma property. Accessible name of the navigation landmark. */
  navLabel?: string;
}

export const DEFAULT_ITEMS: SideBarItem[] = [
  { label: "Dashboard", current: true },
  { label: "Reservations" },
  { label: "Calendar" },
  { label: "Rooms" },
  { label: "Rates" },
  { label: "Finance" },
  { label: "Guests" },
  { label: "Properties" },
  { label: "Reports" },
  { label: "Team and roles" },
  { label: "Audit log" },
  { label: "Settings" },
];

export function SideBar({
  title = "HS Admin",
  organisation = "Casa do Bairro group",
  detail = "4 properties · Lisbon",
  showFooter = true,
  items = DEFAULT_ITEMS,
  navLabel = "Main",
  className,
  ...rest
}: SideBarProps) {
  return (
    <div className={cn("hz-sidebar", className)} {...rest}>
      <div className="hz-sidebar__header">
        <Logo type="mark" alt="" />
        <p className="hz-sidebar__title">{title}</p>
      </div>
      <nav className="hz-sidebar__nav" aria-label={navLabel}>
        <ul className="hz-sidebar__list">
          {items.map((item) => (
            <li key={`${item.label}-${item.href ?? ""}`}>
              <Link
                className={cn(
                  "hz-sidebar__link",
                  item.current && "hz-sidebar__link--active",
                  !item.current && item.state === "hover" && "hz-sidebar__link--hover",
                )}
                label={item.label}
                href={item.href ?? "#"}
                aria-current={item.current ? "page" : undefined}
              />
            </li>
          ))}
        </ul>
      </nav>
      {showFooter && (
        <>
          <div className="hz-sidebar__divider" aria-hidden="true" />
          <div className="hz-sidebar__footer">
            <p className="hz-sidebar__organisation">{organisation}</p>
            <p className="hz-sidebar__detail">{detail}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default SideBar;
