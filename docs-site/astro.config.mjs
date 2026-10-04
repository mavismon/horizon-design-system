// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://horizon-docs-zeta.vercel.app',
	integrations: [
		starlight({
			title: 'Horizon Design System',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/mavismon/horizon-design-system' }],
			customCss: ['@fontsource-variable/inter', './src/styles/horizon-tokens.css', './src/styles/theme.css'],
			// Fails `astro build` on any broken internal link.
			plugins: [starlightLinksValidator({ errorOnLocalLinks: true, errorOnInvalidHashes: true })],
			// Every entry is a slug, never autogenerate, so a missing page fails the build.
			sidebar: [
				{
					label: 'Get Started',
					items: [
						{ label: 'Changelog', slug: 'get-started/changelog' },
						{ label: 'Roadmap', slug: 'get-started/roadmap' },
						{ label: 'News', slug: 'get-started/news' },
						{ label: 'Versioning', slug: 'get-started/versioning' },
						{ label: 'Upgrading', slug: 'get-started/upgrading' },
					],
				},
				{
					label: 'Designing',
					items: [{ label: 'Introduction', slug: 'designing/introduction' }],
				},
				{
					label: 'Developing',
					items: [
						{ label: 'Introduction', slug: 'developing/introduction' },
						{ label: 'React', slug: 'developing/react' },
						{ label: 'React Router', slug: 'developing/react-router' },
					],
				},
				{
					label: 'Skills',
					items: [{ label: 'Knowledge skill', slug: 'skills/knowledge-skill' }],
				},
				{
					label: 'Core',
					items: [
						{
							label: 'Components',
							items: [
								{ label: 'All components', slug: 'core/components/overview' },
								// <generated:components>
								{ label: 'Avatar', slug: 'core/components/avatar' },
								{ label: 'Breadcrumbs', slug: 'core/components/breadcrumbs' },
								{ label: 'Button', slug: 'core/components/button' },
								{ label: 'ButtonGroup', slug: 'core/components/buttongroup' },
								{ label: 'Checkbox', slug: 'core/components/checkbox' },
								{ label: 'Chip', slug: 'core/components/chip' },
								{ label: 'Dropdown', slug: 'core/components/dropdown' },
								{ label: 'File', slug: 'core/components/file' },
								{ label: 'Header', slug: 'core/components/header' },
								{ label: 'Image', slug: 'core/components/image' },
								{ label: 'Link', slug: 'core/components/link' },
								{ label: 'Logo', slug: 'core/components/logo' },
								{ label: 'ProgressBar', slug: 'core/components/progressbar' },
								{ label: 'RadioCard', slug: 'core/components/radiocard' },
								{ label: 'SearchBar', slug: 'core/components/searchbar' },
								{ label: 'Toggle', slug: 'core/components/toggle' },
								// </generated:components>
							],
						},
						{ label: 'Tokens', slug: 'core/tokens' },
					],
				},
				{
					label: 'Styling',
					items: [{ label: 'Theming', slug: 'styling/theming' }],
				},
				{
					label: 'Help',
					items: [
						{ label: 'FAQ', slug: 'help/faq' },
						{ label: 'Report a bug', slug: 'help/bug-report' },
						{ label: 'Request a feature', slug: 'help/feature-request' },
						{ label: 'Contributing', slug: 'help/contributing' },
						{ label: 'Embedding', slug: 'help/embedding' },
					],
				},
			],
		}),
	],
});
