// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=191-123
// Sub-component (segment): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=194-111
// Usage frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=193-59
// Figma properties: type (primary | destructive | secondary | segmented), layout (row | stack),
// showThird and showFourth (booleans, default false). Figma's ShowThird / ShowFourth map to the
// camelCase booleans `showThird` / `showFourth`.
// Not Figma properties (added so the component is usable): labels (texts by slot; Figma edits them
// inside the instances), onItemClick (button types), value / defaultValue / onValueChange (segmented,
// selected slot index; default 0 as drawn), plus passthrough div attributes and aria-label.
// layout="stack" is not available for type="segmented" (a type error). Figma draws no hover,
// pressed or disabled states for the group; the segment keyboard focus ring is the native outline.
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ButtonGroup } from "./ButtonGroup";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  args: { "aria-label": "Actions" },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

const Stack = ({ children }: { children: ReactNode }) => <div style={{ width: 320 }}>{children}</div>;

// type: primary
export const PrimaryRow: Story = { args: { type: "primary", layout: "row" } };
export const PrimaryStack: Story = {
  args: { type: "primary", layout: "stack" },
  decorators: [(Story) => <Stack><Story /></Stack>],
};
// type: destructive
export const DestructiveRow: Story = { args: { type: "destructive", layout: "row" } };
export const DestructiveStack: Story = {
  args: { type: "destructive", layout: "stack" },
  decorators: [(Story) => <Stack><Story /></Stack>],
};
// type: secondary
export const SecondaryRow: Story = { args: { type: "secondary", layout: "row" } };
export const SecondaryStack: Story = {
  args: { type: "secondary", layout: "stack" },
  decorators: [(Story) => <Stack><Story /></Stack>],
};
// type: segmented (row only)
export const SegmentedRow: Story = {
  args: { type: "segmented", layout: "row", "aria-label": "Time range" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "max-content 320px", gap: 32, alignItems: "start" }}>
      {(["primary", "destructive", "secondary"] as const).map((type) => [
        <ButtonGroup key={`${type}-row`} type={type} layout="row" aria-label={`${type} row`} />,
        <ButtonGroup key={`${type}-stack`} type={type} layout="stack" aria-label={`${type} stack`} />,
      ])}
      <ButtonGroup type="segmented" layout="row" aria-label="Time range" />
    </div>
  ),
};
