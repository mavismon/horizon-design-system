// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1649
// Component (form, 2 types): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=241-91
// Textfield (internal part, 5 states): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=240-37
// Examples: Invite with an error (242-94), Sign in (242-65).
// Figma properties: type (section | card), ShowDescription, ShowField3, ShowField4, ShowFootnote,
// ShowLink, Title, Description. ShowField3/4 and ShowFootnote apply to section; ShowLink to card.
// Variant matrix: 2 types x ShowDescription x ShowField3 x ShowField4 x ShowFootnote x ShowLink = 64
// instances; the AllVariants story renders all of them. Textfield states: default, focused, filled,
// error, disabled (Textfield story). No sizes. Figma draws no hover or pressed state for the form.
// Not Figma properties: fields, children, footnote, actionLabels, linkLabel, linkHref, onCancel.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { Form } from "./Form";
import { Textfield } from "./Textfield";
import { Dropdown } from "../Dropdown/Dropdown";
import { Checkbox } from "../Checkbox/Checkbox";
import { Toggle } from "../Toggle/Toggle";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  args: { type: "section" },
  argTypes: { type: { control: "inline-radio", options: ["section", "card"] } },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Section: Story = {};
export const SectionWithoutDescription: Story = { args: { showDescription: false } };
export const SectionWithoutField3: Story = { args: { showField3: false } };
export const SectionWithoutField3And4: Story = { args: { showField3: false, showField4: false } };
export const SectionWithoutFootnote: Story = { args: { showFootnote: false } };

export const Card: Story = { args: { type: "card" } };
export const CardWithoutDescription: Story = { args: { type: "card", showDescription: false } };
export const CardWithoutLink: Story = { args: { type: "card", showLink: false } };

export const InviteWithError: Story = {
  args: {
    type: "card",
    title: "Invite someone to HS Admin",
    description: "They get an email with a link that works for 7 days.",
    showLink: false,
    actionLabels: ["Send invite"],
    fields: [
      {
        label: "Work email",
        defaultValue: "kwame.o@horizonstays",
        state: "error",
        error: "Use a full email address, like name@horizonstays.com",
      },
      { label: "Full name", defaultValue: "Kwame Osei", state: "filled" },
    ],
  },
};

export const WithChoiceFields: Story = {
  args: { showField3: false, showField4: false, showFootnote: false },
  render: (args) => (
    <Form {...args}>
      <Dropdown label="Language" options={["English", "Portugues", "Francais"]} defaultValue="English" />
      <Checkbox label="Email me booking updates" />
      <Toggle aria-label="Show my photo to hosts" />
    </Form>
  ),
};

// Real interaction: type into a field, submit with the main action, cancel with the second.
export const Interaction: Story = {
  args: { onSubmit: fn((e) => e.preventDefault()), onCancel: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const field = c.getByLabelText("Display name");
    await userEvent.type(field, "Mei T");
    await expect(field).toHaveValue("Mei T");
    await userEvent.click(c.getByRole("button", { name: "Save changes" }));
    await expect(args.onSubmit).toHaveBeenCalled();
    await userEvent.click(c.getByRole("button", { name: "Cancel" }));
    await expect(args.onCancel).toHaveBeenCalled();
  },
};

export const CardKeyboard: Story = {
  args: { type: "card", onSubmit: fn((e) => e.preventDefault()) },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.tab();
    await expect(c.getByLabelText("Email")).toHaveFocus();
    await userEvent.tab();
    await expect(c.getByLabelText("Password")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

const textfieldStates = ["default", "focused", "filled", "error", "disabled"] as const;

export const TextfieldStates: StoryObj<typeof Textfield> = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      {textfieldStates.map((state) => (
        <div key={state}>
          <p style={{ font: "12px sans-serif", margin: "0 0 8px" }}>state={state}</p>
          <Textfield
            state={state}
            defaultValue={state === "default" || state === "focused" ? undefined : "mei.tanaka@gmail.com"}
          />
        </div>
      ))}
    </div>
  ),
};

const bool = [true, false];

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["section", "card"] as const).map((type) => (
        <div key={type}>
          <p style={{ font: "12px sans-serif", margin: "0 0 8px" }}>type={type}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {bool.flatMap((showDescription) =>
              bool.flatMap((showField3) =>
                bool.flatMap((showField4) =>
                  bool.flatMap((showFootnote) =>
                    bool.map((showLink) => (
                      <Form
                        key={`${showDescription}-${showField3}-${showField4}-${showFootnote}-${showLink}`}
                        type={type}
                        showDescription={showDescription}
                        showField3={showField3}
                        showField4={showField4}
                        showFootnote={showFootnote}
                        showLink={showLink}
                      />
                    )),
                  ),
                ),
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
