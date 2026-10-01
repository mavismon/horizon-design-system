// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=121-15
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=122-2
// Only the published states (unselected, selected, selected-strong) are built. hover, focus,
// pressed and disabled are not drawn in Figma and are not styled here; the native button's
// own focus ring and disabled behaviour apply.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  args: {
    label: "Label",
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Unselected: Story = {
  args: { state: "unselected" },
};

export const Selected: Story = {
  args: { state: "selected" },
};

export const SelectedStrong: Story = {
  args: { state: "selected-strong" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <Chip {...args} state="unselected" />
      <Chip {...args} state="selected" />
      <Chip {...args} state="selected-strong" />
    </div>
  ),
};
