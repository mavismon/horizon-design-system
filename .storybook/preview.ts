import type { Preview } from "@storybook/react-vite";
import "../build/css/tokens.css";
import "../build/css/tokens-dark.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
