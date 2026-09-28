import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import starIcon from "../../assets/icons/star.svg";

export type ButtonState = "default" | "hover" | "error" | "outline" | "outline error";

const STATE_CLASS: Record<ButtonState, string> = {
  default: "hz-button--default",
  hover: "hz-button--hover",
  error: "hz-button--error",
  outline: "hz-button--outline",
  "outline error": "hz-button--outline-error",
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text?: string;
  state?: ButtonState;
  startIcon?: boolean;
  endIcon?: boolean;
  swapIcon?: ReactNode;
}

export function Button({
  text = "Label",
  state = "default",
  startIcon = true,
  endIcon = true,
  swapIcon,
  className,
  ...rest
}: ButtonProps) {
  const renderIcon = () =>
    swapIcon ?? <img src={starIcon} alt="" className="hz-button__icon" />;

  return (
    <button type="button" className={cn("hz-button", STATE_CLASS[state], className)} {...rest}>
      {startIcon && renderIcon()}
      <span>{text}</span>
      {endIcon && renderIcon()}
    </button>
  );
}

export default Button;
