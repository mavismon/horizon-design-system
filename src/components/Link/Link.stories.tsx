// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=133-12
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=134-2
// One story per published cell (2 sizes x 2 states = 4). Figma draws no focus, visited,
// disabled or inline-underlined variants, so none are built: the native <a> focus ring,
// href/target/rel behaviour and :visited apply. The hover story forces the underline for
// display; a real :hover gives the same result in any story.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  args: {
    label: "Link",
    href: "#",
  },
  argTypes: {
    size: { control: "select", options: ["md", "sm"] },
    state: { control: "select", options: ["default", "hover"] },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const MdDefault: Story = {
  // node 133:4
  args: { size: "md", state: "default" },
};

export const MdHover: Story = {
  // node 133:6
  args: { size: "md", state: "hover" },
};

export const SmDefault: Story = {
  // node 133:8
  args: { size: "sm", state: "default" },
};

export const SmHover: Story = {
  // node 133:10
  args: { size: "sm", state: "hover" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 96px)", gap: 24 }}>
      {(["md", "sm"] as const).map((size) =>
        (["default", "hover"] as const).map((state) => (
          <Link key={`${size}-${state}`} {...args} size={size} state={state} />
        )),
      )}
    </div>
  ),
};
