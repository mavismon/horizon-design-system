// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1639
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=163-13
// One story per published cell (showItem2 x showItem3 = 4). The 3-level and 2-level rows in
// the spec frame are the same cells with the same props (node 163:16 = showItem2 false;
// node 163:29 = both false), so they add no extra stories. Figma draws no hover, focus or
// visited variants: the native <a> focus ring and href behaviour apply. item1Href/item2Href/
// item3Href are not Figma properties; they are the native href of each ancestor link.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    item1: "Stays",
    item2: "Portugal",
    item3: "Lisbon",
    current: "Alfama",
    item1Href: "#",
    item2Href: "#",
    item3Href: "#",
  },
  argTypes: {
    showItem2: { control: "boolean" },
    showItem3: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Item2TrueItem3True: Story = {
  // node 164:1504
  args: { showItem2: true, showItem3: true },
};

export const Item2FalseItem3True: Story = {
  // node 164:1516
  args: { showItem2: false, showItem3: true },
};

export const Item2TrueItem3False: Story = {
  // node 164:1529
  args: { showItem2: true, showItem3: false },
};

export const Item2FalseItem3False: Story = {
  // node 164:1542
  args: { showItem2: false, showItem3: false },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {([true, false] as const).map((showItem3) =>
        ([true, false] as const).map((showItem2) => (
          <Breadcrumbs
            key={`${showItem2}-${showItem3}`}
            {...args}
            showItem2={showItem2}
            showItem3={showItem3}
          />
        )),
      )}
    </div>
  ),
};
