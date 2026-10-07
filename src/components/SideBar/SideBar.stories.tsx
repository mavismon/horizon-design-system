// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1651
// Component (sidebar): node 246:11, 220 x 1000. Specimen board: node 233:14320 (ShowFooter true | false).
// Item part (_sidebar-item, state default | hover | active): node 246:10, specimen board 233:14406.
// Example page (sidebar + header type=backoffice): node 247:21. Usage frame: node 247:520.
// Figma properties: Title, Organisation, Detail, ShowFooter; the nav items are _sidebar-item
// instances (state default | hover | active, label edited from the layers), up to 12.
// Figma names map to the camelCase props title, organisation, detail, showFooter and items.
// Variant matrix: ShowFooter (true | false) x item state (default | hover | active). No sizes.
// Composes Logo (type mark) and Link (each nav item).
// Not Figma properties (added so the component is usable): items[].href, navLabel.
// Figma draws no focus, pressed or disabled state, no collapsed state and no small-screen layout.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SideBar, DEFAULT_ITEMS } from "./SideBar";
import type { SideBarItem } from "./SideBar";
import { Header } from "../Header/Header";
import samplephoto from "../../assets/images/avatar-sample.jpg";

const meta: Meta<typeof SideBar> = {
  title: "Components/SideBar",
  component: SideBar,
  decorators: [
    (Story) => (
      <div style={{ height: 1000 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SideBar>;

const withCurrent = (label: string): SideBarItem[] =>
  DEFAULT_ITEMS.map((item) => ({ label: item.label, current: item.label === label }));

// Specimen board 233:14320.
export const Default: Story = {};
export const WithoutFooter: Story = { args: { showFooter: false } };

// _sidebar-item states (board 233:14406). Active is the default story's Dashboard.
export const CurrentPage: Story = { args: { items: withCurrent("Calendar") } };
export const ItemHover: Story = {
  args: {
    items: DEFAULT_ITEMS.map((item) => ({
      ...item,
      state: item.label === "Reservations" ? ("hover" as const) : ("default" as const),
    })),
  },
};

export const LongLabelAndFooter: Story = {
  args: {
    items: [
      { label: "Dashboard", current: true },
      { label: "Reservations, check-ins and check-outs for every property" },
    ],
    organisation: "Casa do Bairro group with a very long organisation name",
    detail: "4 properties · Lisbon · Porto · Faro · Madeira",
  },
};

export const FewItems: Story = {
  args: { items: DEFAULT_ITEMS.slice(0, 5), showFooter: true },
};

// Real interaction: clicking an item moves aria-current and the active fill. Tab, Enter and
// shift+Tab work because every item is a native link.
export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = useState("Dashboard");
    const items = DEFAULT_ITEMS.map((item) => ({
      label: item.label,
      href: `#${item.label}`,
      current: item.label === current,
    }));
    return (
      <div
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (link) {
            event.preventDefault();
            setCurrent(link.textContent ?? "");
          }
        }}
        style={{ height: "100%" }}
      >
        <SideBar {...args} items={items} />
      </div>
    );
  },
};

// Example page, node 247:21: sidebar on the left, header type=backoffice to its right.
export const BackOfficePage: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: "flex", width: 1440, height: 1000 }}>
        <Story />
        <div style={{ flex: 1 }}>
          <Header type="backoffice" pageTitle="Dashboard" avatarSrc={samplephoto} />
        </div>
      </div>
    ),
  ],
};
