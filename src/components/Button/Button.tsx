import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import starIcon from "../../assets/icons/star.svg";
import styles from "./Button.module.css";

export type ButtonState = "default" | "hover" | "error" | "outline" | "outline error";

const STATE_CLASS: Record<ButtonState, string> = {
  default: styles.default,
  hover: styles.hover,
  error: styles.error,
  outline: styles.outline,
  "outline error": styles.outlineError,
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
    swapIcon ?? <img src={starIcon} alt="" className={styles.icon} />;

  return (
    <button type="button" className={cn(styles.button, STATE_CLASS[state], className)} {...rest}>
      {startIcon && renderIcon()}
      <span>{text}</span>
      {endIcon && renderIcon()}
    </button>
  );
}

export default Button;
