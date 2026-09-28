#!/usr/bin/env node
// After `astro build`: every internal href/src in dist/**/*.html must resolve to a
// built file, and every #fragment to an id on the target page. Prints the count.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const pages = [];
const walk = (d) => {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const p = path.join(d, e.name);
		if (e.isDirectory()) walk(p);
		else if (p.endsWith('.html')) pages.push(p);
	}
};
walk(DIST);
const ids = new Map();
const idsOf = (file) => {
	if (!ids.has(file)) ids.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
	return ids.get(file);
};
const resolveTarget = (p) => {
	const f = path.join(DIST, decodeURIComponent(p));
	if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
	if (fs.existsSync(path.join(f, 'index.html'))) return path.join(f, 'index.html');
	return null;
};
let checked = 0;
const broken = [];
for (const page of pages) {
	const html = fs.readFileSync(page, 'utf8');
	for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
		const url = m[1].replace(/&amp;/g, '&');
		if (/^(https?:|mailto:|data:|javascript:)/.test(url) || url.startsWith('//')) continue;
		checked++;
		const [pathPart, hash] = url.split('#');
		const clean = pathPart.split('?')[0];
		const target = clean === '' ? page : clean.startsWith('/') ? resolveTarget(clean) : resolveTarget(path.relative(DIST, path.resolve(path.dirname(page), clean)));
		if (!target) broken.push(`${path.relative(DIST, page)} -> ${url} (no such file)`);
		else if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) broken.push(`${path.relative(DIST, page)} -> ${url} (no #${hash})`);
	}
}
console.log(`${pages.length} HTML pages, ${checked} internal links checked, ${broken.length} broken`);
for (const b of broken) console.log('  ' + b);
process.exit(broken.length ? 1 : 0);
