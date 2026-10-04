// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1643
// Component set (header): node 208:43. Variants: type=web (1280x64), type=app (390x52), type=backoffice (1220x56).
// Figma properties: type, link1, link2, link3, showButton, showAvatar (web, backoffice); title, showBack,
// showAction, action (app); pageTitle, showSearch (backoffice).
// Not Figma properties: search (slot for the backoffice Searchbar, which does not exist in the repo yet),
// buttonText, avatarSrc, avatarAlt, link1Href..link3Href, onButtonClick, onBackClick, onActionClick.
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  argTypes: { type: { control: "select", options: ["web", "app", "backoffice"] } },
};

export default meta;
type Story = StoryObj<typeof Header>;

const Frame = (width: number) => (Story: () => ReactNode) => <div style={{ width }}>{Story()}</div>;

// Stand-in for the Searchbar component (not yet built); native input so the slot is exercisable.
const searchStandIn = <input type="search" placeholder="Search" aria-label="Search" />;

// type: web
export const Web: Story = { args: { type: "web" }, decorators: [Frame(1280)] };
export const WebSignedOut: Story = { args: { type: "web", showAvatar: false }, decorators: [Frame(1280)] };
export const WebNoButton: Story = { args: { type: "web", showButton: false }, decorators: [Frame(1280)] };
// type: app
export const App: Story = { args: { type: "app" }, decorators: [Frame(390)] };
export const AppWithAction: Story = { args: { type: "app", showAction: true }, decorators: [Frame(390)] };
export const AppNoBack: Story = { args: { type: "app", showBack: false }, decorators: [Frame(390)] };
// type: backoffice
export const Backoffice: Story = {
  args: { type: "backoffice", search: searchStandIn },
  decorators: [Frame(1220)],
};
export const BackofficeNoSearch: Story = {
  args: { type: "backoffice", showSearch: false },
  decorators: [Frame(1220)],
};
export const BackofficeSignedOut: Story = {
  args: { type: "backoffice", showAvatar: false, search: searchStandIn },
  decorators: [Frame(1220)],
};
