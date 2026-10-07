// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1648
// Component (card, 2 types): https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=238-24
// Usage frame: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=239-51
// Figma properties: type (listing | stat), showTag, showAction, showRating (listing), showHelper
// (stat), plus text overrides tag, title, details, price, rating, action, label, value, helper.
// Variant matrix: 2 types x ShowTag x ShowAction x ShowRating x ShowHelper = 32 instances; the
// AllVariants story renders all of them. No sizes. Figma draws no hover, focus, pressed or
// disabled state, so none is built: the card is a static container. Not Figma properties:
// image/imageAlt (the photo layer fill). The listing photo is the Image component at ratio 2:1.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import placeholder from "../../assets/images/image-placeholder.png";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  args: { type: "listing", image: placeholder },
  argTypes: {
    type: { control: "inline-radio", options: ["listing", "stat"] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Listing: Story = {};
export const ListingWithTag: Story = { args: { showTag: true } };
export const ListingWithAction: Story = { args: { showAction: true } };
export const ListingWithoutRating: Story = { args: { showRating: false } };
export const ListingTagAndAction: Story = { args: { showTag: true, showAction: true } };
export const ListingTruncation: Story = {
  args: {
    title: "Casa do Bairro with a very long name that cannot fit on one line",
    details: "Alfama, Lisbon · 14 to 18 Sep · free cancellation until 10 Sep",
  },
};

export const Stat: Story = { args: { type: "stat" } };
export const StatWithoutHelper: Story = { args: { type: "stat", showHelper: false } };
export const StatWithAction: Story = { args: { type: "stat", showAction: true } };

const bool = [true, false];

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["listing", "stat"] as const).map((type) => (
        <div key={type}>
          <p style={{ font: "12px sans-serif", margin: "0 0 8px" }}>type={type}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {bool.flatMap((showTag) =>
              bool.flatMap((showAction) =>
                bool.map((flag) => (
                  <Card
                    key={`${showTag}-${showAction}-${flag}`}
                    {...args}
                    type={type}
                    showTag={showTag}
                    showAction={showAction}
                    {...(type === "listing" ? { showRating: flag } : { showHelper: flag })}
                  />
                )),
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
