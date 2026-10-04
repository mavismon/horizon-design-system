// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1645
// Component set: node 213:54 (searchbar). Cells: 213:2 field/md/empty, 213:6 field/md/focused,
// 213:10 field/md/filled, 213:16 field/lg/empty, 213:20 field/lg/focused, 213:24 field/lg/filled,
// 213:30 stay/lg/filled (960 wide). Specimen board: node 214:7. Usage frame (When to use, Do not use,
// Best Practice): node 214:29, kept in Figma.
// Figma properties: type (field | stay), size (md | lg), state (empty | focused | filled), Placeholder,
// Value, and the stay values Where, Check in, Check out, Guests. Figma names map to the camelCase props
// `placeholder`, `value`, `where`, `checkIn`, `checkOut`, `guests`.
// Composes Button (stay, the nested Search button).
// Not Figma properties (added so the component is usable): defaultValue, onValueChange, onSearch,
// onClear, label, name. Figma draws no hover, pressed or disabled state.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// type=field, size=md
export const FieldMdEmpty: Story = { args: { type: "field", size: "md", state: "empty" } };
export const FieldMdFocused: Story = { args: { type: "field", size: "md", state: "focused" } };
export const FieldMdFilled: Story = { args: { type: "field", size: "md", state: "filled", value: "Alfama" } };
// type=field, size=lg
export const FieldLgEmpty: Story = { args: { type: "field", size: "lg", state: "empty" } };
export const FieldLgFocused: Story = { args: { type: "field", size: "lg", state: "focused" } };
export const FieldLgFilled: Story = { args: { type: "field", size: "lg", state: "filled", value: "Alfama" } };
// type=stay, size=lg, state=filled (960 wide)
export const StayLgFilled: Story = {
  args: { type: "stay" },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <Story />
      </div>
    ),
  ],
};

// Specimen board 214:14, 214:19, 214:24.
export const BackOffice: Story = { args: { size: "md", placeholder: "Search" } };
export const TripsWeb: Story = { args: { size: "md", placeholder: "Search by property or reference" } };
export const AppLarge: Story = { args: { size: "lg" } };

export const AllVariants: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 320px)", gap: 24, alignItems: "start" }}>
      <SearchBar size="md" state="empty" />
      <SearchBar size="lg" state="empty" />
      <SearchBar size="md" state="focused" />
      <SearchBar size="lg" state="focused" />
      <SearchBar size="md" state="filled" />
      <SearchBar size="lg" state="filled" />
      <div style={{ gridColumn: "1 / span 2", width: 960 }}>
        <SearchBar type="stay" />
      </div>
    </div>
  ),
};

// Real interaction: Tab or click focuses the field (blue border); typing shows the clear button;
// clear empties the field and returns focus to it; Enter reports the search.
export const Interactive: Story = {
  render: () => {
    const [searched, setSearched] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SearchBar placeholder="Search messages" onSearch={(v) => setSearched(v ?? "")} />
        <span>Last search: {searched || "none"}</span>
      </div>
    );
  },
};

// Stay: pressing the Search button reports the search.
export const StayInteractive: Story = {
  decorators: [(Story) => <Story />],
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div style={{ width: 960, display: "flex", flexDirection: "column", gap: 12 }}>
        <SearchBar type="stay" onSearch={() => setCount((n) => n + 1)} />
        <span>Searches: {count}</span>
      </div>
    );
  },
};
