// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=113-2
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";
import samplephoto from "../../assets/images/avatar-sample.jpg";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    src: samplephoto,
    alt: "",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Sm: Story = {
  args: { size: "sm" },
};

export const Md: Story = {
  args: { size: "md" },
};

export const Lg: Story = {
  args: { size: "lg" },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};
