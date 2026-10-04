// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1644
// Component set: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=212-21
// Usage frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=212-49
// Figma properties: state (unselected | selected | disabled), title, description, showDescription,
// showTrailing, trailing. Variant matrix: 3 states x showDescription x showTrailing (no sizes).
// Not Figma properties: name, value, onChange and other input attributes. `state` is controlled:
// the group (see Group story, as in the Figma "Payment group") decides which card is selected.
// Figma draws no hover or pressed state; keyboard focus shows the focus-border ring.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCard } from "./RadioCard";

const meta: Meta<typeof RadioCard> = {
  title: "Components/RadioCard",
  component: RadioCard,
  args: {
    title: "Whole apartment · 2 bedrooms",
    description: "Sleeps 4 · free cancellation until 12 Sep",
    showDescription: true,
    showTrailing: true,
    trailing: "484.00 EUR",
  },
  argTypes: {
    state: { control: "inline-radio", options: ["unselected", "selected", "disabled"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RadioCard>;

export const Unselected: Story = { args: { state: "unselected", name: "rate", value: "a" } };
export const Selected: Story = { args: { state: "selected", name: "rate", value: "a" } };
export const Disabled: Story = { args: { state: "disabled", name: "rate", value: "a" } };

export const UnselectedWithoutDescription: Story = {
  args: { state: "unselected", showDescription: false },
};
export const SelectedWithoutDescription: Story = {
  args: { state: "selected", showDescription: false },
};
export const DisabledWithoutDescription: Story = {
  args: { state: "disabled", showDescription: false },
};
export const UnselectedWithoutTrailing: Story = {
  args: { state: "unselected", showTrailing: false },
};
export const SelectedWithoutTrailing: Story = {
  args: { state: "selected", showTrailing: false },
};
export const DisabledWithoutTrailing: Story = {
  args: { state: "disabled", showTrailing: false },
};
export const SelectedTitleOnly: Story = {
  args: { state: "selected", showDescription: false, showTrailing: false },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <RadioCard {...args} state="unselected" />
      <RadioCard {...args} state="selected" />
      <RadioCard {...args} state="disabled" />
    </div>
  ),
};

const PAYMENT = [
  { value: "card", title: "Visa ending 4242", description: "Default card · expires 08/28", trailing: "0.00 EUR now" },
  { value: "later", title: "Pay at the property", description: "Pay when you arrive", trailing: "484.00 EUR" },
  { value: "voucher", title: "Voucher", description: "Not available for this booking", trailing: "", disabled: true },
] as const;

/** Real interaction: click a card, or Tab to the group and use the arrow keys. */
export const Group: Story = {
  render: () => {
    const [value, setValue] = useState<string>("card");
    return (
      <div role="radiogroup" aria-label="Payment" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PAYMENT.map((o) => (
          <RadioCard
            key={o.value}
            name="payment"
            value={o.value}
            title={o.title}
            description={o.description}
            trailing={o.trailing}
            showTrailing={o.trailing !== ""}
            state={"disabled" in o ? "disabled" : value === o.value ? "selected" : "unselected"}
            onChange={() => setValue(o.value)}
          />
        ))}
      </div>
    );
  },
};
