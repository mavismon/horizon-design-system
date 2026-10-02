// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=144-20
// Spec frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=145-2
// Figma's combined `state` maps to the native props: off = unchecked; on = checked;
// disabled-off = disabled + unchecked; disabled-on = disabled + checked.
// Figma draws no hover, pressed, focus, error or loading states, so none are styled here.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  args: { size: "md", "aria-label": "Setting" },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// state: off
export const MdOff: Story = { args: { size: "md", defaultChecked: false } };
export const SmOff: Story = { args: { size: "sm", defaultChecked: false } };
// state: on
export const MdOn: Story = { args: { size: "md", defaultChecked: true } };
export const SmOn: Story = { args: { size: "sm", defaultChecked: true } };
// state: disabled-off
export const MdDisabledOff: Story = { args: { size: "md", disabled: true, defaultChecked: false } };
export const SmDisabledOff: Story = { args: { size: "sm", disabled: true, defaultChecked: false } };
// state: disabled-on
export const MdDisabledOn: Story = { args: { size: "md", disabled: true, defaultChecked: true } };
export const SmDisabledOn: Story = { args: { size: "sm", disabled: true, defaultChecked: true } };

const states = [
  { name: "off", checked: false, disabled: false },
  { name: "on", checked: true, disabled: false },
  { name: "disabled-off", checked: false, disabled: true },
  { name: "disabled-on", checked: true, disabled: true },
];

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, max-content)", gap: 16, alignItems: "center" }}>
      {states.map((s) =>
        (["md", "sm"] as const).map((size) => (
          <Toggle
            key={`${s.name}-${size}`}
            size={size}
            defaultChecked={s.checked}
            disabled={s.disabled}
            aria-label={`${size} ${s.name}`}
          />
        )),
      )}
    </div>
  ),
};
