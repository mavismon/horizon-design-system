import { useId, useState } from "react";
import type { HTMLAttributes, MouseEvent } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";
import type { ButtonState } from "../Button/Button";

export type ButtonGroupType = "primary" | "destructive" | "secondary" | "segmented";
export type ButtonGroupLayout = "row" | "stack";

const ACTION_LABELS = {
  primary: ["Save", "Cancel", "More"],
  destructive: ["Delete", "Keep it", "More"],
  secondary: ["View", "Modify", "More"],
} as const;

const SEGMENT_LABELS = ["Last 24 hours", "7 days", "30 days", "Custom range"] as const;

// First button state per type; the second and third buttons are always outline.
const FIRST_STATE = {
  primary: "default",
  destructive: "error",
  secondary: "outline",
} as const satisfies Record<string, ButtonState>;

interface ButtonGroupBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "role"> {
  /** Figma `showThird`: adds a third button or segment. */
  showThird?: boolean;
  /** Figma `showFourth`: adds a fourth segment (segmented only; no effect on the button types). */
  showFourth?: boolean;
  /** Not a Figma property. Texts by slot (first, second, third, fourth); defaults are the Figma texts. */
  labels?: string[];
}

export interface ButtonGroupActionProps extends ButtonGroupBaseProps {
  /** primary (default), destructive or secondary: composed from Button. */
  type?: Exclude<ButtonGroupType, "segmented">;
  /** row (default) or stack (full width, main action on top). */
  layout?: ButtonGroupLayout;
  /** Not a Figma property. Called when a button is clicked, with its slot index. */
  onItemClick?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonGroupSegmentedProps extends ButtonGroupBaseProps {
  type: "segmented";
  /** Segmented is row only. */
  layout?: "row";
  /** Not a Figma property. Selected slot index (controlled). */
  value?: number;
  /** Not a Figma property. Selected slot index (uncontrolled); default 0. */
  defaultValue?: number;
  /** Not a Figma property. Called with the slot index of the newly selected segment. */
  onValueChange?: (index: number) => void;
}

export type ButtonGroupProps = ButtonGroupActionProps | ButtonGroupSegmentedProps;

function ActionGroup({
  type = "primary",
  layout = "row",
  showThird = false,
  showFourth: _showFourth,
  labels,
  onItemClick,
  className,
  ...rest
}: ButtonGroupActionProps) {
  const defaults = ACTION_LABELS[type];
  const slots = showThird ? [0, 1, 2] : [0, 1];
  return (
    <div
      role="group"
      className={cn("hz-buttongroup", `hz-buttongroup--${layout}`, className)}
      {...rest}
    >
      {slots.map((i) => (
        <Button
          key={i}
          className="hz-buttongroup__button"
          text={labels?.[i] ?? defaults[i]}
          state={i === 0 ? FIRST_STATE[type] : "outline"}
          startIcon={false}
          endIcon={false}
          onClick={(event) => onItemClick?.(i, event)}
        />
      ))}
    </div>
  );
}

function SegmentedGroup({
  type: _type,
  layout: _layout,
  showThird = false,
  showFourth = false,
  labels,
  value,
  defaultValue = 0,
  onValueChange,
  className,
  ...rest
}: ButtonGroupSegmentedProps) {
  const name = useId();
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  // showFourth is independent of showThird, as drawn in Figma.
  const slots = [0, 1, ...(showThird ? [2] : []), ...(showFourth ? [3] : [])];
  return (
    <div
      role="radiogroup"
      className={cn("hz-buttongroup", "hz-buttongroup--row", "hz-buttongroup--segmented", className)}
      {...rest}
    >
      {slots.map((i) => (
        <label
          key={i}
          className={cn("hz-buttongroup__segment", i === selected && "hz-buttongroup__segment--selected")}
        >
          <input
            type="radio"
            className="hz-buttongroup__input"
            name={name}
            checked={i === selected}
            onChange={() => {
              setInner(i);
              onValueChange?.(i);
            }}
          />
          {labels?.[i] ?? SEGMENT_LABELS[i]}
        </label>
      ))}
    </div>
  );
}

export function ButtonGroup(props: ButtonGroupProps) {
  return props.type === "segmented" ? <SegmentedGroup {...props} /> : <ActionGroup {...props} />;
}

export default ButtonGroup;
