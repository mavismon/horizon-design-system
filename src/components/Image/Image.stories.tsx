// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=123-22
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=124-2
// One story per published variant (5 ratios x 3 radii = 15). Figma draws no states, so none are
// built: no loading, error or hover state. alt, loading and focus are the native <img>'s own.
// The placeholder is the Figma node's photo-layer fill, committed locally because Figma asset
// URLs expire after 7 days.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "./Image";
import placeholder from "../../assets/images/image-placeholder.png";

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  args: {
    src: placeholder,
    alt: "",
  },
  argTypes: {
    ratio: {
      control: "select",
      options: ["4:3", "1:1", "3:2", "16:9", "2:1"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Image>;

export const R43None: Story = {
  // node 123:8
  args: { ratio: "4:3", radius: "none" },
};

export const R43Sm: Story = {
  // node 123:7
  args: { ratio: "4:3", radius: "sm" },
};

export const R43Md: Story = {
  // node 123:9
  args: { ratio: "4:3", radius: "md" },
};

export const R11None: Story = {
  // node 123:11
  args: { ratio: "1:1", radius: "none" },
};

export const R11Sm: Story = {
  // node 123:10
  args: { ratio: "1:1", radius: "sm" },
};

export const R11Md: Story = {
  // node 123:12
  args: { ratio: "1:1", radius: "md" },
};

export const R32None: Story = {
  // node 123:14
  args: { ratio: "3:2", radius: "none" },
};

export const R32Sm: Story = {
  // node 123:13
  args: { ratio: "3:2", radius: "sm" },
};

export const R32Md: Story = {
  // node 123:15
  args: { ratio: "3:2", radius: "md" },
};

export const R169None: Story = {
  // node 123:17
  args: { ratio: "16:9", radius: "none" },
};

export const R169Sm: Story = {
  // node 123:16
  args: { ratio: "16:9", radius: "sm" },
};

export const R169Md: Story = {
  // node 123:18
  args: { ratio: "16:9", radius: "md" },
};

export const R21None: Story = {
  // node 123:20
  args: { ratio: "2:1", radius: "none" },
};

export const R21Sm: Story = {
  // node 123:19
  args: { ratio: "2:1", radius: "sm" },
};

export const R21Md: Story = {
  // node 123:21
  args: { ratio: "2:1", radius: "md" },
};

export const AllVariants: Story = {
  decorators: [],
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: 24 }}>
      {(["4:3", "1:1", "3:2", "16:9", "2:1"] as const).map((ratio) =>
        (["none", "sm", "md"] as const).map((radius) => (
          <Image key={`${ratio}-${radius}`} {...args} ratio={ratio} radius={radius} />
        )),
      )}
    </div>
  ),
};
