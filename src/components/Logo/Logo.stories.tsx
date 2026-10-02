// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=137-17
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=137-18
// One story per published variant (type = lockup | mark), plus AllVariants. Figma draws no
// states, sizes or dark version, so none are built. Brand colours are fixed on purpose and
// do not follow UI tokens (Figma component description). The mark is the real brand SVG,
// committed locally because Figma asset URLs expire after 7 days.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  argTypes: {
    type: { control: "select", options: ["lockup", "mark"] },
    alt: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Lockup: Story = {
  // node 137:6
  args: { type: "lockup" },
};

export const Mark: Story = {
  // node 137:12
  args: { type: "mark" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
      <Logo type="lockup" />
      <Logo type="mark" />
    </div>
  ),
};
