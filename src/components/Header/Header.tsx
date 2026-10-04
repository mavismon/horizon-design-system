import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "../../lib/utils";
import avatarSample from "../../assets/images/avatar-sample.jpg";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Link } from "../Link/Link";
import { Logo } from "../Logo/Logo";

export type HeaderType = "web" | "app" | "backoffice";

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** web (default), app or backoffice. */
  type?: HeaderType;
  /** web: nav link texts. Link 1 is the current page (darker). */
  link1?: string;
  link2?: string;
  link3?: string;
  /** web: Figma ShowButton (default true). */
  showButton?: boolean;
  /** web and backoffice: Figma ShowAvatar (default true; off = signed out on web). */
  showAvatar?: boolean;
  /** app: centred title. */
  title?: string;
  /** app: Figma ShowBack (default true). */
  showBack?: boolean;
  /** app: Figma ShowAction (default false). */
  showAction?: boolean;
  /** app: the text action on the right. */
  action?: string;
  /** backoffice: page title. */
  pageTitle?: string;
  /** backoffice: Figma ShowSearch (default true). */
  showSearch?: boolean;
  /** Not a Figma property. Rendered when showSearch is on (backoffice). Pass a Searchbar once that component exists. */
  search?: ReactNode;
  /** Not a Figma property. Text of the nested Button (web); Figma draws "Book now". */
  buttonText?: string;
  /** Not a Figma property. Avatar photo; defaults to the sample photo Figma draws. */
  avatarSrc?: string;
  avatarAlt?: string;
  /** Not a Figma property. Link destinations (web). */
  link1Href?: string;
  link2Href?: string;
  link3Href?: string;
  onButtonClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onBackClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

function BackChevron() {
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
  search,
  buttonText = "Book now",
  avatarSrc = avatarSample,
  avatarAlt = "",
  link1Href = "#",
  link2Href = "#",
  link3Href = "#",
  onButtonClick,
  onBackClick,
  onActionClick,
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
              <button
                type="button"
                className="hz-header__back"
                aria-label="Back"
                onClick={onBackClick}
              >
                <BackChevron />
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
            {showSearch && search}
            {avatar}
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
