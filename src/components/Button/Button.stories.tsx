import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    text: "Label",
    startIcon: true,
    endIcon: true,
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "hover", "error", "outline", "outline-error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { state: "default" },
};

export const Hover: Story = {
  args: { state: "hover" },
};

export const Error: Story = {
  args: { state: "error" },
};

export const Outline: Story = {
  args: { state: "outline" },
};

export const OutlineError: Story = {
  args: { state: "outline-error" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Button {...args} state="default" />
      <Button {...args} state="hover" />
      <Button {...args} state="error" />
      <Button {...args} state="outline" />
      <Button {...args} state="outline-error" />
    </div>
  ),
};
