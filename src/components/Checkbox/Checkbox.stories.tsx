// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=117-23
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=118-2
// Only the published states (unchecked, checked) are built. error, disabled, hover, focus and
// indeterminate are not drawn in Figma and are not styled here.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    label: "Label",
    showLabel: true,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { defaultChecked: false },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const UncheckedWithoutLabel: Story = {
  args: { defaultChecked: false, showLabel: false, "aria-label": "Label" },
};

export const CheckedWithoutLabel: Story = {
  args: { defaultChecked: true, showLabel: false, "aria-label": "Label" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Checkbox {...args} defaultChecked={false} />
      <Checkbox {...args} defaultChecked />
      <Checkbox {...args} defaultChecked={false} showLabel={false} aria-label="Label" />
      <Checkbox {...args} defaultChecked showLabel={false} aria-label="Label" />
    </div>
  ),
};
