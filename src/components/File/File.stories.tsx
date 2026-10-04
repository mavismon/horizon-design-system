// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1642
// Component set: node 204:41 (file). Cells: 204:6 dropzone/default, 204:9 dropzone/dragover,
// 204:12 item/uploaded, 204:19 item/uploading, 204:34 item/error.
// Usage frame: node 204:76 (use / do not use / best practice).
// Figma properties: type (dropzone | item), state (default | dragover | uploaded | uploading | error),
// Title and Hint (dropzone), File name, file type badge and meta (item). Figma names map to the
// camelCase props `title`, `hint`, `fileName`, `fileType`, `meta`.
// Composes ProgressBar (size sm, label and helper hidden) for state=uploading.
// Not Figma properties (added so the component is usable): progress, actionLabel, onAction, onFiles,
// accept, multiple, disabled. A dropzone with no `state` follows real drag events.
// Figma draws no hover, pressed or disabled states; keyboard focus uses the focus border colour.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { ReactNode } from "react";
import { File } from "./File";

const meta: Meta<typeof File> = {
  title: "Components/File",
  component: File,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof File>;

// type=dropzone
export const DropzoneDefault: Story = { args: { type: "dropzone", state: "default" } };
export const DropzoneDragover: Story = { args: { type: "dropzone", state: "dragover" } };
// type=item
export const ItemUploaded: Story = { args: { type: "item", state: "uploaded" } };
export const ItemUploading: Story = { args: { type: "item", state: "uploading", progress: 60 } };
export const ItemError: Story = { args: { type: "item", state: "error" } };

// Figma instance 204:65: Title and Hint edited.
export const DropzoneCustomCopy: Story = {
  args: {
    type: "dropzone",
    state: "default",
    title: "Drag photos here, or browse",
    hint: "JPG or PNG · at least 1600 px wide · 10 MB each",
  },
};
// Figma instance 204:69: image file item.
export const ItemImageFile: Story = {
  args: { type: "item", state: "uploaded", fileName: "passport-mei.jpg", fileType: "JPG", meta: "JPG · 1.8 MB" },
};

const Cell = ({ children }: { children: ReactNode }) => <div style={{ width: 400 }}>{children}</div>;

export const AllVariants: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 400px)", gap: 24, alignItems: "start" }}>
      <Cell><File type="dropzone" state="default" /></Cell>
      <Cell><File type="dropzone" state="dragover" /></Cell>
      <div />
      <Cell><File type="item" state="uploaded" /></Cell>
      <Cell><File type="item" state="uploading" /></Cell>
      <Cell><File type="item" state="error" /></Cell>
    </div>
  ),
};

// Real interaction: click or Tab + Enter/Space opens the file picker; dragging a file over the zone
// switches it to dragover; choosing or dropping files adds an item; Remove deletes it.
export const Interactive: Story = {
  render: () => {
    const [names, setNames] = useState<string[]>([]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <File
          type="dropzone"
          multiple
          onFiles={(files) => setNames((n) => [...n, ...Array.from(files).map((f) => f.name)])}
        />
        {names.map((name, i) => (
          <File
            key={`${name}-${i}`}
            type="item"
            state="uploaded"
            fileName={name}
            fileType={name.split(".").pop()?.toUpperCase().slice(0, 4) ?? "FILE"}
            meta="Added"
            onAction={() => setNames((n) => n.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    );
  },
};
