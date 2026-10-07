// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1650
// Component (modal, 4 variants): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=243-181
// Usage frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=244-154
// Dialog on overlay example: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=244-74
// Figma properties: type (dialog | sheet), tone (default | destructive), showClose, showContent,
// showNote. Variant matrix: 2 types x 2 tones x showClose x showContent x showNote = 32
// instances; the AllVariants story renders all of them. No sizes. Figma draws no hover, focus or
// disabled state for the panel itself; the actions are the ButtonGroup and the close x is a
// native button with the focus ring used elsewhere. Not Figma properties: open, onClose,
// onAction, title, message, note, labels, closeLabel, rows and children (the Content slot).
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "padded" },
  argTypes: {
    type: { control: "inline-radio", options: ["dialog", "sheet"] },
    tone: { control: "inline-radio", options: ["default", "destructive"] },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Dialog: Story = { args: { type: "dialog", tone: "default" } };
export const DialogDestructive: Story = { args: { type: "dialog", tone: "destructive" } };
export const Sheet: Story = { args: { type: "sheet", tone: "default" } };
export const SheetDestructive: Story = { args: { type: "sheet", tone: "destructive" } };

export const WithoutClose: Story = { args: { showClose: false } };
export const WithoutContent: Story = { args: { tone: "destructive", showContent: false } };
export const WithoutNote: Story = { args: { showNote: false } };
export const CustomContent: Story = {
  args: {
    children: (
      <p style={{ margin: 0, font: "13px/20px sans-serif" }}>
        Any content can replace the detail rows.
      </p>
    ),
  },
};

const bool = [true, false];

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["dialog", "sheet"] as const).flatMap((type) =>
        (["default", "destructive"] as const).map((tone) => (
          <div key={`${type}-${tone}`}>
            <p style={{ font: "12px sans-serif", margin: "0 0 8px" }}>
              type={type}, tone={tone}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
              {bool.flatMap((showClose) =>
                bool.flatMap((showContent) =>
                  bool.map((showNote) => (
                    <Modal
                      key={`${showClose}-${showContent}-${showNote}`}
                      {...args}
                      type={type}
                      tone={tone}
                      showClose={showClose}
                      showContent={showContent}
                      showNote={showNote}
                    />
                  )),
                ),
              )}
            </div>
          </div>
        )),
      )}
    </div>
  ),
};

// Figma 244:74: the dialog drawn on the color/bg/overlay backdrop (40% layer opacity, per the token).
export const OnOverlay: Story = {
  args: { type: "dialog", tone: "destructive" },
  render: (args) => (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: 960,
        maxWidth: "100%",
        height: 560,
        background: "color-mix(in srgb, var(--color-bg-overlay) 40%, var(--color-bg-surface))",
      }}
    >
      <Modal {...args} />
    </div>
  ),
};

function Opener({ type, tone }: { type: "dialog" | "sheet"; tone: "default" | "destructive" }) {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState("Nothing confirmed yet.");
  return (
    <div>
      <Button
        text={`Open ${type} (${tone})`}
        state={tone === "destructive" ? "error" : "default"}
        startIcon={false}
        endIcon={false}
        onClick={() => setOpen(true)}
      />
      <p style={{ font: "13px sans-serif" }}>{log}</p>
      <Modal
        type={type}
        tone={tone}
        open={open}
        onClose={() => setOpen(false)}
        onAction={() => {
          setLog(`Confirmed: ${tone}`);
          setOpen(false);
        }}
      />
    </div>
  );
}

// On screen: a native modal dialog. Focus is trapped and returns to the button on close; Escape,
// the close x, Cancel and a click on the backdrop all close it.
export const OpenDialog: Story = { render: () => <Opener type="dialog" tone="default" /> };
export const OpenDialogDestructive: Story = { render: () => <Opener type="dialog" tone="destructive" /> };
export const OpenSheet: Story = { render: () => <Opener type="sheet" tone="default" /> };
export const OpenSheetDestructive: Story = { render: () => <Opener type="sheet" tone="destructive" /> };
