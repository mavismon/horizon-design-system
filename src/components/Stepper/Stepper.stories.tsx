// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1646
// Component set: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=215-73
// Step part (_stepper-step, internal): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=215-15
// Usage frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=216-84
// Figma properties: type (progress | quantity), state (default | at-min | at-max, quantity only),
// label, showLabel (quantity), showStep4, showStep5 (progress). Variant matrix built: progress x
// 5/4/3 steps, quantity x 3 states, plus quantity without label. No sizes. Figma draws no hover or
// pressed state; keyboard focus shows the focus-border ring. Not Figma properties: steps (the
// per-step Label/Number/state layer overrides), value, onDecrement/onIncrement, onStepClick.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  args: { type: "progress", state: "default", label: "Adults", showLabel: true, showStep4: true, showStep5: true },
  argTypes: {
    type: { control: "inline-radio", options: ["progress", "quantity"] },
    state: { control: "inline-radio", options: ["default", "at-min", "at-max"] },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const ProgressFiveSteps: Story = { args: { type: "progress" } };
export const ProgressFourSteps: Story = { args: { type: "progress", showStep5: false } };
export const ProgressThreeSteps: Story = { args: { type: "progress", showStep4: false, showStep5: false } };

export const QuantityDefault: Story = { args: { type: "quantity", state: "default" } };
export const QuantityAtMin: Story = { args: { type: "quantity", state: "at-min" } };
export const QuantityAtMax: Story = { args: { type: "quantity", state: "at-max" } };
export const QuantityWithoutLabel: Story = { args: { type: "quantity", showLabel: false } };

/** Real interaction: Tab to a done step (click or Enter goes back to it); Tab to - and + on the counter. */
export const Interactive: Story = {
  render: () => {
    const labels = ["Dates and guests", "Your details", "Extras", "Payment", "Confirm"];
    const [current, setCurrent] = useState(2);
    const [adults, setAdults] = useState(2);
    const MIN = 0;
    const MAX = 8;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Stepper
          type="progress"
          steps={labels.map((label, i) => ({
            label,
            state: i < current ? "done" : i === current ? "current" : "upcoming",
          }))}
          onStepClick={setCurrent}
        />
        <button type="button" onClick={() => setCurrent((c) => Math.min(c + 1, labels.length - 1))}>
          Next step
        </button>
        <Stepper
          type="quantity"
          label="Adults"
          value={adults}
          state={adults <= MIN ? "at-min" : adults >= MAX ? "at-max" : "default"}
          onDecrement={() => setAdults((n) => Math.max(n - 1, MIN))}
          onIncrement={() => setAdults((n) => Math.min(n + 1, MAX))}
        />
      </div>
    );
  },
};
