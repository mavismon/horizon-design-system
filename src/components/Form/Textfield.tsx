import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type TextfieldState = "default" | "focused" | "filled" | "error" | "disabled";

export interface TextfieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: string;
  showHelper?: boolean;
  /** Replaces the helper when state is error. */
  error?: string;
  /** Figma `state`. focused is a static display of the focus border; real focus works regardless. */
  state?: TextfieldState;
  /** Class for the outer wrapper (the rest of the props go to the input). */
  wrapperClassName?: string;
}

export function Textfield({
  label = "Email",
  helper = "We send booking confirmations here.",
  showHelper = true,
  error = "Enter an email address like name@example.com",
  state = "default",
  placeholder = "you@example.com",
  wrapperClassName,
  className,
  id,
  disabled,
  ...rest
}: TextfieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const noteId = `${inputId}-note`;
  const isError = state === "error";
  const isDisabled = state === "disabled" || Boolean(disabled);
  const note = isError ? error : showHelper ? helper : "";

  return (
    <div
      className={cn(
        "hz-textfield",
        state === "focused" && "hz-textfield--focused",
        isError && "hz-textfield--error",
        isDisabled && "hz-textfield--disabled",
        wrapperClassName,
      )}
    >
      <label className="hz-textfield__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn("hz-textfield__input", className)}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-invalid={isError || undefined}
        aria-describedby={note ? noteId : undefined}
        {...rest}
      />
      {note && (
        <p id={noteId} className="hz-textfield__note">
          {note}
        </p>
      )}
    </div>
  );
}

export default Textfield;
