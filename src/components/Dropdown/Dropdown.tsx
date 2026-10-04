import { useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { cn } from "../../lib/utils";

export type DropdownSize = "md" | "sm";

export interface DropdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** md field 36px (default), sm field 30px. */
  size?: DropdownSize;
  /** Text above the field. */
  label?: string;
  /** Figma ShowLabel. When false the label text is kept as the accessible name. */
  showLabel?: boolean;
  /** Option texts in the open menu, in order. */
  options?: string[];
  /** Current choice (controlled). Always one of `options`. */
  value?: string;
  /** Initial choice when uncontrolled; defaults to the first option. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Menu visibility (controlled). Figma state=open. */
  open?: boolean;
  /** Initial menu visibility when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma state=disabled. */
  disabled?: boolean;
  /** Adds a hidden input so the value posts with a form. */
  name?: string;
}

const DEFAULT_OPTIONS = ["All properties", "Casa do Bairro", "Hotel Miramar", "Alfama Lofts"];

export function Dropdown({
  size = "md",
  label = "Label",
  showLabel = true,
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  name,
  className,
  ...rest
}: DropdownProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const buttonId = `${uid}-button`;
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-option-${i}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0] ?? "");
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const current = value ?? innerValue;
  const isOpen = !disabled && (open ?? innerOpen);
  const selectedIndex = Math.max(0, options.indexOf(current));
  const [active, setActive] = useState(selectedIndex);

  const setOpen = (next: boolean) => {
    if (next) setActive(selectedIndex);
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const choose = (option: string) => {
    if (value === undefined) setInnerValue(option);
    onValueChange?.(option);
    setOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[active] !== undefined) choose(options[active]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn("hz-dropdown", `hz-dropdown--${size}`, disabled && "hz-dropdown--disabled", className)}
      {...rest}
    >
      {showLabel && (
        <span id={labelId} className="hz-dropdown__label">
          {label}
        </span>
      )}
      <div className="hz-dropdown__control">
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          className={cn("hz-dropdown__field", isOpen && "hz-dropdown__field--open")}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen ? optionId(active) : undefined}
          aria-labelledby={showLabel ? `${labelId} ${buttonId}` : undefined}
          aria-label={showLabel ? undefined : label}
          onClick={() => setOpen(!isOpen)}
          onKeyDown={onKeyDown}
        >
          <span className="hz-dropdown__value">{current}</span>
          <svg className="hz-dropdown__chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.25L6 7.75L9.5 4.25" />
          </svg>
        </button>
        {isOpen && (
          <ul id={listId} role="listbox" aria-labelledby={showLabel ? labelId : undefined} aria-label={showLabel ? undefined : label} className="hz-dropdown__menu">
            {options.map((option, i) => (
              <li
                key={option}
                id={optionId(i)}
                role="option"
                aria-selected={i === selectedIndex}
                className={cn(
                  "hz-dropdown__option",
                  i === selectedIndex && "hz-dropdown__option--selected",
                  i === active && "hz-dropdown__option--active",
                )}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    </div>
  );
}

export default Dropdown;
