import type { HTMLAttributes, MouseEvent } from "react";
import { cn } from "../../lib/utils";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Link } from "../Link/Link";
import { Logo } from "../Logo/Logo";
import { SearchBar } from "../SearchBar/SearchBar";

export type HeaderType = "web" | "app" | "backoffice";

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Figma `type`. web (default), app or backoffice. */
  type?: HeaderType;
  /** web: nav link text (Figma `Link 1`). Link 1 is the current page, drawn darker. */
  link1?: string;
  link2?: string;
  link3?: string;
  /** web: Figma `ShowButton` (default true). */
  showButton?: boolean;
  /** web and backoffice: Figma `ShowAvatar` (default true). Off on web = signed out. */
  showAvatar?: boolean;
  /** app: centred title (Figma `Title`). */
  title?: string;
  /** app: Figma `ShowBack` (default true). */
  showBack?: boolean;
  /** app: Figma `ShowAction` (default false). */
  showAction?: boolean;
  /** app: text of the action on the right (Figma `Action`). */
  action?: string;
  /** backoffice: Figma `PageTitle`. */
  pageTitle?: string;
  /** backoffice: Figma `ShowSearch` (default true). */
  showSearch?: boolean;
  /** Not a Figma property. Text of the nested web Button; Figma draws "Book now". */
  buttonText?: string;
  /** Not a Figma property. Avatar photo (web, backoffice). Omitted, the circle is empty. */
  avatarSrc?: string;
  /** Not a Figma property. Avatar alt text; empty by default (decorative). */
  avatarAlt?: string;
  /** Not a Figma property. Backoffice search placeholder; Figma draws "Search". */
  searchPlaceholder?: string;
  /** Not a Figma property. Link destinations (web). */
  link1Href?: string;
  link2Href?: string;
  link3Href?: string;
  /** Not a Figma property. Handlers so the bar is usable. */
  onButtonClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onBackClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSearch?: (value?: string) => void;
}

function BackIcon() {
  return (
    <svg
      className="hz-header__back-icon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.5 4L6.5 10L12.5 16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header({
  type = "web",
  link1 = "Stays",
  link2 = "Experiences",
  link3 = "Help",
  showButton = true,
  showAvatar = true,
  title = "Profile",
  showBack = true,
  showAction = false,
  action = "Save",
  pageTitle = "Calendar",
  showSearch = true,
  buttonText = "Book now",
  avatarSrc,
  avatarAlt = "",
  searchPlaceholder = "Search",
  link1Href = "#",
  link2Href = "#",
  link3Href = "#",
  onButtonClick,
  onBackClick,
  onActionClick,
  onSearch,
  className,
  ...rest
}: HeaderProps) {
  const avatar = showAvatar && <Avatar size="md" src={avatarSrc} alt={avatarAlt} />;

  return (
    <header className={cn("hz-header", `hz-header--${type}`, className)} {...rest}>
      {type === "web" && (
        <>
          <Logo type="lockup" />
          <div className="hz-header__right">
            <nav className="hz-header__nav" aria-label="Main">
              <Link
                className="hz-header__link hz-header__link--current"
                label={link1}
                href={link1Href}
                aria-current="page"
              />
              <Link className="hz-header__link" label={link2} href={link2Href} />
              <Link className="hz-header__link" label={link3} href={link3Href} />
            </nav>
            {showButton && (
              <Button
                className="hz-header__button"
                text={buttonText}
                state="default"
                startIcon={false}
                endIcon={false}
                onClick={onButtonClick}
              />
            )}
            {avatar}
          </div>
        </>
      )}
      {type === "app" && (
        <>
          <div className="hz-header__side">
            {showBack && (
              <button type="button" className="hz-header__back" aria-label="Back" onClick={onBackClick}>
                <BackIcon />
              </button>
            )}
          </div>
          <h1 className="hz-header__title">{title}</h1>
          <div className="hz-header__side hz-header__side--end">
            {showAction && (
              <button type="button" className="hz-header__action" onClick={onActionClick}>
                {action}
              </button>
            )}
          </div>
        </>
      )}
      {type === "backoffice" && (
        <>
          <h1 className="hz-header__page-title">{pageTitle}</h1>
          <div className="hz-header__right hz-header__right--backoffice">
            {showSearch && (
              <SearchBar
                className="hz-header__search"
                size="md"
                placeholder={searchPlaceholder}
                onSearch={onSearch}
              />
            )}
            {avatar}
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
