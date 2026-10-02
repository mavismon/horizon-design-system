// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=140-66
// One story per built cell (2 sizes x 3 tones = 6). The inverse tone is deliberately not built:
// Figma draws its track and fill in the same colour (unresolved design bug), so no track colour
// is invented. Figma draws no states, so none are built: no hover, focus, disabled, loading or
// indeterminate. The element is a native <progress>.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  args: {
    size: "md",
    tone: "primary",
    value: 60,
    label: "Label",
    helper: "Helper text",
    showLabel: true,
    showHelper: true,
  },
  argTypes: {
    size: { control: "select", options: ["md", "sm"] },
    tone: { control: "select", options: ["primary", "success", "neutral"] },
    value: { control: { type: "range", min: 0, max: 100, step: 10 } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const MdPrimary: Story = {
  // node 140:5
  args: { size: "md", tone: "primary" },
};

export const SmPrimary: Story = {
  // node 140:17
  args: { size: "sm", tone: "primary" },
};

export const MdSuccess: Story = {
  // node 140:24
  args: { size: "md", tone: "success" },
};

export const SmSuccess: Story = {
  // node 140:31
  args: { size: "sm", tone: "success" },
};

export const MdNeutral: Story = {
  // node 140:38
  args: { size: "md", tone: "neutral" },
};

export const SmNeutral: Story = {
  // node 140:45
  args: { size: "sm", tone: "neutral" },
};

export const AllVariants: Story = {
  decorators: [],
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 300px)", gap: 24 }}>
      {(["primary", "success", "neutral"] as const).map((tone) =>
        (["md", "sm"] as const).map((size) => (
          <ProgressBar key={`${size}-${tone}`} {...args} size={size} tone={tone} />
        )),
      )}
    </div>
  ),
};
