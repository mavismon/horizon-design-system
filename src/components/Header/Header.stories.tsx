// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1643
// Component set: node 208:43 (header). Cells: 208:7 type=web (1280x64), 208:29 type=app (390x52),
// 208:36 type=backoffice (1220x56). Specimen board: node 209:4849 (every boolean combination of
// each type's properties). Usage frame (When to use, Do not use, Best Practice): node 208:670,
// kept in Figma.
// Figma properties: type (web | app | backoffice); web: Link 1/2/3, ShowButton, ShowAvatar;
// app: Title, Action, ShowBack, ShowAction; backoffice: PageTitle, ShowSearch, ShowAvatar.
// Figma names map to the camelCase props link1, link2, link3, showButton, showAvatar, title,
// action, showBack, showAction, pageTitle, showSearch.
// Composes Logo, Link (web nav), Button (web), Avatar (web, backoffice), SearchBar (backoffice).
// Not Figma properties (added so the component is usable): buttonText, avatarSrc, avatarAlt,
// searchPlaceholder, link1Href..link3Href, onButtonClick, onBackClick, onActionClick, onSearch.
// Figma draws no hover, pressed or disabled state for the header itself.
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Header } from "./Header";
import samplephoto from "../../assets/images/avatar-sample.jpg";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  args: { avatarSrc: samplephoto },
  argTypes: {
    type: { control: "select", options: ["web", "app", "backoffice"] },
  },
  decorators: [
    (Story, ctx) => {
      const widths = { web: 1280, app: 390, backoffice: 1220 } as const;
      return (
        <div style={{ width: widths[(ctx.args.type ?? "web") as keyof typeof widths] }}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Cells of component set 208:43.
export const Web: Story = { args: { type: "web" } };
export const App: Story = { args: { type: "app" } };
export const Backoffice: Story = { args: { type: "backoffice" } };

// Specimen board 209:4849: web, ShowButton x ShowAvatar.
export const WebSignedOut: Story = { args: { type: "web", showAvatar: false } };
export const WebNoButton: Story = { args: { type: "web", showButton: false } };
export const WebNoButtonSignedOut: Story = { args: { type: "web", showButton: false, showAvatar: false } };
// App, ShowBack x ShowAction.
export const AppAction: Story = { args: { type: "app", showAction: true } };
export const AppNoBack: Story = { args: { type: "app", showBack: false } };
export const AppNoBackAction: Story = { args: { type: "app", showBack: false, showAction: true } };
// Backoffice, ShowSearch x ShowAvatar.
export const BackofficeNoSearch: Story = { args: { type: "backoffice", showSearch: false } };
export const BackofficeNoAvatar: Story = { args: { type: "backoffice", showAvatar: false } };
export const BackofficeNoSearchNoAvatar: Story = {
  args: { type: "backoffice", showSearch: false, showAvatar: false },
};

function Row({ label, width, children }: { label: string; width: number; children: ReactNode }) {
  return (
    <div>
      <div style={{ font: "12px sans-serif", marginBottom: 4 }}>{label}</div>
      <div style={{ width }}>{children}</div>
    </div>
  );
}

export const AllVariants: Story = {
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <Row label="web" width={1280}><Header {...args} type="web" /></Row>
      <Row label="web, signed out" width={1280}><Header {...args} type="web" showAvatar={false} /></Row>
      <Row label="web, no button" width={1280}><Header {...args} type="web" showButton={false} /></Row>
      <Row label="web, no button, signed out" width={1280}>
        <Header {...args} type="web" showButton={false} showAvatar={false} />
      </Row>
      <Row label="app" width={390}><Header {...args} type="app" /></Row>
      <Row label="app, action" width={390}><Header {...args} type="app" showAction /></Row>
      <Row label="app, no back" width={390}><Header {...args} type="app" showBack={false} /></Row>
      <Row label="app, no back, action" width={390}>
        <Header {...args} type="app" showBack={false} showAction />
      </Row>
      <Row label="backoffice" width={1220}><Header {...args} type="backoffice" /></Row>
      <Row label="backoffice, no search" width={1220}>
        <Header {...args} type="backoffice" showSearch={false} />
      </Row>
      <Row label="backoffice, no avatar" width={1220}>
        <Header {...args} type="backoffice" showAvatar={false} />
      </Row>
      <Row label="backoffice, no search, no avatar" width={1220}>
        <Header {...args} type="backoffice" showSearch={false} showAvatar={false} />
      </Row>
    </div>
  ),
};
