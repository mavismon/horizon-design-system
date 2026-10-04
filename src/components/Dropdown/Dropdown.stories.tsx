// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1641
// Component set: node 199:66 (dropdown); option part: node 199:11 (_dropdown-option, internal, not exported).
// Figma properties: size (md | sm), state (closed | open | disabled), ShowLabel -> `showLabel`,
// Label -> `label`, Value -> the selected entry of `options`.
// Figma's `state` maps to behaviour, not a prop: closed = default; open = `defaultOpen` (or controlled `open`);
// disabled = `disabled`. Not Figma properties (added so the component is usable): options, value /
// defaultValue / onValueChange, open / onOpenChange, name.
// Figma draws no hover, pressed or error states, so none are styled; keyboard focus uses the
// focus border colour, and the keyboard-active option gets a focus-colour inset outline.
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  args: { label: "Label", showLabel: true, size: "md" },
  decorators: [
    (Story) => (
      <div style={{ width: 240, minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// size=md
export const MdClosed: Story = { args: { size: "md" } };
export const MdOpen: Story = { args: { size: "md", defaultOpen: true } };
export const MdDisabled: Story = { args: { size: "md", disabled: true } };
// size=sm
export const SmClosed: Story = { args: { size: "sm" } };
export const SmOpen: Story = { args: { size: "sm", defaultOpen: true } };
export const SmDisabled: Story = { args: { size: "sm", disabled: true } };

// Figma instance 200:17: ShowLabel false, e.g. a sort control whose value says what it is.
export const LabelHidden: Story = {
  args: {
    size: "md",
    showLabel: false,
    label: "Sort",
    options: ["Sort: Price, low first", "Sort: Price, high first", "Sort: Rating"],
  },
};

// Figma instance 200:24: Label + Value, sm.
export const LabelAndValue: Story = { args: { size: "sm", label: "Property" } };

const Cell = ({ children }: { children: ReactNode }) => <div style={{ width: 240, minHeight: 200 }}>{children}</div>;

export const AllVariants: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 240px)", gap: 24 }}>
      {(["closed", "open", "disabled"] as const).map((state) =>
        (["md", "sm"] as const).map((size) => (
          <Cell key={`${state}-${size}`}>
            <Dropdown
              size={size}
              label={`${size} ${state}`}
              defaultOpen={state === "open"}
              disabled={state === "disabled"}
            />
          </Cell>
        )),
      )}
    </div>
  ),
};

// Real interaction: click or Enter / Space / arrow keys to open, arrows + Home / End to move,
// Enter / Space / click to choose, Escape or an outside click to close.
export const Interactive: Story = { args: { size: "md", label: "Property" } };
