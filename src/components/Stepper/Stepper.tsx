import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type StepperType = "progress" | "quantity";
export type StepperState = "default" | "at-min" | "at-max";
export type StepperStepState = "done" | "current" | "upcoming";

export interface StepperStep {
  label: string;
  /** Number shown in the circle for current and upcoming steps. Defaults to the step's position. */
  number?: string;
  state: StepperStepState;
}

const DEFAULT_STEPS: StepperStep[] = [
  { label: "Dates and guests", state: "done" },
  { label: "Your details", state: "done" },
  { label: "Extras", state: "current" },
  { label: "Payment", state: "upcoming" },
  { label: "Confirm", state: "upcoming" },
];

const DEFAULT_VALUE: Record<StepperState, number> = { default: 2, "at-min": 0, "at-max": 8 };

export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "onChange"> {
  /** progress (default): the steps of a flow. quantity: a - value + counter. */
  type?: StepperType;
  /** quantity only. default, at-min (- disabled) or at-max (+ disabled). */
  state?: StepperState;
  /** quantity only. Label beside the counter; also the counter's accessible name. */
  label?: string;
  /** quantity only. */
  showLabel?: boolean;
  /** quantity only. The number shown; defaults to the Figma example for the state (2, 0 or 8). */
  value?: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
  /** progress only. Three to five steps; the Figma example is used when omitted. */
  steps?: StepperStep[];
  /** progress only. Hide step 4 (and its connector). */
  showStep4?: boolean;
  /** progress only. Hide step 5 (and its connector). */
  showStep5?: boolean;
  /** progress only. When set, done steps become buttons that call this with the step index. */
  onStepClick?: (index: number) => void;
}

function TickIcon() {
  return (
    <svg className="hz-stepper__tick" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.25 4.9 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="hz-stepper__icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="hz-stepper__icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Stepper({
  type = "progress",
  state = "default",
  label = "Adults",
  showLabel = true,
  value,
  onDecrement,
  onIncrement,
  steps = DEFAULT_STEPS,
  showStep4 = true,
  showStep5 = true,
  onStepClick,
  className,
  ...rest
}: StepperProps) {
  if (type === "quantity") {
    const shown = value ?? DEFAULT_VALUE[state];
    return (
      <div
        role="group"
        aria-label={label}
        className={cn("hz-stepper", "hz-stepper--quantity", className)}
        {...rest}
      >
        {showLabel && <span className="hz-stepper__label">{label}</span>}
        <div className="hz-stepper__counter">
          <button
            type="button"
            className="hz-stepper__button"
            aria-label={`Decrease ${label}`}
            disabled={state === "at-min"}
            onClick={onDecrement}
          >
            <MinusIcon />
          </button>
          <output className="hz-stepper__value" aria-live="polite">
            {shown}
          </output>
          <button
            type="button"
            className="hz-stepper__button"
            aria-label={`Increase ${label}`}
            disabled={state === "at-max"}
            onClick={onIncrement}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    );
  }

  const visible = steps.filter((_, i) => !(i === 3 && !showStep4) && !(i === 4 && !showStep5));
  return (
    <ol className={cn("hz-stepper", "hz-stepper--progress", className)} {...(rest as HTMLAttributes<HTMLOListElement>)}>
      {visible.map((step, i) => {
        const index = steps.indexOf(step);
        const number = step.number ?? String(index + 1);
        const content = (
          <>
            <span className="hz-stepper__circle" aria-hidden="true">
              {step.state === "done" ? <TickIcon /> : number}
            </span>
            <span className="hz-stepper__step-label">{step.label}</span>
          </>
        );
        const clickable = step.state === "done" && onStepClick;
        return (
          <li
            key={index}
            className={cn("hz-stepper__item", `hz-stepper__item--${step.state}`)}
            aria-current={step.state === "current" ? "step" : undefined}
          >
            {i > 0 && <span className="hz-stepper__connector" aria-hidden="true" />}
            {clickable ? (
              <button type="button" className="hz-stepper__step hz-stepper__step--button" onClick={() => onStepClick(index)}>
                {content}
              </button>
            ) : (
              <span className="hz-stepper__step">{content}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
