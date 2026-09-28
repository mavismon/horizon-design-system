// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://horizon-docs-zeta.vercel.app',
	integrations: [
		starlight({
			title: 'Horizon Design System',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/mavismon/horizon-design-system' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
