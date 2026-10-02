import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import logoMark from "../../assets/images/logo-mark.svg";

export type LogoType = "lockup" | "mark";

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  type?: LogoType;
  alt?: string;
}

export function Logo({ type = "lockup", alt, className, ...rest }: LogoProps) {
  const isMark = type === "mark";
  const markAlt = alt ?? (isMark ? "Horizon Stays" : "");
  return (
    <span
      className={cn("hz-logo", isMark ? "hz-logo--mark" : "hz-logo--lockup", className)}
      {...rest}
    >
      <img className="hz-logo__mark" src={logoMark} alt={markAlt} width={32} height={32} />
      {!isMark && <span className="hz-logo__wordmark">Horizon Stays</span>}
    </span>
  );
}

export default Logo;
