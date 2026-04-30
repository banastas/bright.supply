import { existsSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';

const ROOT_URL = 'https://bright.supply';

const checks = [];

const record = (name, passed, detail = '') => {
    checks.push({ name, passed, detail });
};

const readText = (path) => readFileSync(path, 'utf8');

const parseJson = (path) => JSON.parse(readText(path));

const pathExists = (path) => existsSync(path);

const localPathFromUrl = (value) => {
    if (!value || value.startsWith('http:') || value.startsWith('https:')) {
        return null;
    }

    const withoutQuery = value.split('?')[0].split('#')[0];
    const normalized = withoutQuery.startsWith('/') ? withoutQuery.slice(1) : withoutQuery;
    return normalized || 'index.html';
};

const getPngSize = (path) => {
    const buffer = readFileSync(path);
    const signature = buffer.toString('hex', 0, 8);
    if (signature !== '89504e470d0a1a0a') {
        throw new Error(`${path} is not a PNG file`);
    }

    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20)
    };
};

const validateJavaScript = (path) => {
    const result = spawnSync(process.execPath, ['--check', path], {
        encoding: 'utf8'
    });

    record(`${path} syntax`, result.status === 0, result.stderr.trim());
};

validateJavaScript('app.js');
validateJavaScript('sw.js');
validateJavaScript('scripts/validate.mjs');

let manifest;
let packageJson;

try {
    manifest = parseJson('manifest.json');
    record('manifest.json parses', true);
} catch (error) {
    record('manifest.json parses', false, error instanceof Error ? error.message : String(error));
}

try {
    packageJson = parseJson('package.json');
    record('package.json parses', true);
} catch (error) {
    record('package.json parses', false, error instanceof Error ? error.message : String(error));
}

const html = readText('index.html');
const assetPattern = /\b(?:href|src)=["']([^"']+)["']/g;
const htmlRefs = [...html.matchAll(assetPattern)].map((match) => match[1]);

for (const ref of htmlRefs) {
    const localPath = localPathFromUrl(ref);
    if (!localPath) {
        continue;
    }

    record(`HTML reference exists: ${ref}`, pathExists(localPath), localPath);
}

if (manifest) {
    const manifestAssetRefs = [
        ...(manifest.icons || []).map((icon) => icon.src),
        ...(manifest.screenshots || []).map((screenshot) => screenshot.src),
        ...(manifest.shortcuts || []).flatMap((shortcut) => (shortcut.icons || []).map((icon) => icon.src))
    ];

    for (const ref of manifestAssetRefs) {
        const localPath = localPathFromUrl(ref);
        record(`Manifest asset exists: ${ref}`, Boolean(localPath && pathExists(localPath)), localPath || ref);
    }

    for (const image of [...(manifest.icons || []), ...(manifest.screenshots || [])]) {
        const localPath = localPathFromUrl(image.src);
        if (!localPath || !pathExists(localPath) || !image.sizes) {
            continue;
        }

        const size = getPngSize(localPath);
        const declaredSizes = image.sizes.split(/\s+/);
        const matchesDeclaredSize = declaredSizes.includes(`${size.width}x${size.height}`);
        record(
            `Manifest size matches ${image.src}`,
            matchesDeclaredSize,
            `declared ${image.sizes}, actual ${size.width}x${size.height}`
        );
    }

    const shortcutUrls = (manifest.shortcuts || []).map((shortcut) => shortcut.url);
    for (const url of shortcutUrls) {
        const params = new URL(url, ROOT_URL).searchParams;
        const preset = params.get('preset');
        record(
            `Shortcut preset is supported: ${url}`,
            ['low', 'medium', 'high', 'max'].includes(preset),
            preset || 'missing preset'
        );
    }
}

const serviceWorker = readText('sw.js');
const staticFilesMatch = serviceWorker.match(/const STATIC_FILES = \[([\s\S]*?)\];/);
if (staticFilesMatch) {
    const staticFiles = [...staticFilesMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
    for (const file of staticFiles) {
        const localPath = localPathFromUrl(file);
        record(`Service worker cache file exists: ${file}`, Boolean(localPath && pathExists(localPath)), localPath || file);
    }
} else {
    record('Service worker static file list is readable', false);
}

const sitemap = readText('sitemap.xml');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapImages = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);

for (const loc of [...sitemapLocs, ...sitemapImages]) {
    const url = new URL(loc);
    const localPath = localPathFromUrl(`${url.pathname}${url.search}`);
    record(`Sitemap local target exists: ${loc}`, Boolean(localPath && pathExists(localPath)), localPath || loc);
}

if (packageJson) {
    for (const file of packageJson.files || []) {
        record(`Package file exists: ${file}`, pathExists(file), file);
    }

    record(
        'Package includes service worker',
        (packageJson.files || []).includes('sw.js')
    );
    record(
        'Package includes validation script',
        (packageJson.files || []).includes('scripts/validate.mjs')
    );
    record(
        'Package includes asset images',
        (packageJson.files || []).includes('assets/images/bright.supply.png') &&
            (packageJson.files || []).includes('assets/images/readme.png')
    );
}

const failures = checks.filter((check) => !check.passed);

for (const check of checks) {
    const marker = check.passed ? 'PASS' : 'FAIL';
    const detail = check.detail ? ` - ${check.detail}` : '';
    process.stdout.write(`${marker} ${check.name}${detail}\n`);
}

if (failures.length > 0) {
    process.stderr.write(`\n${failures.length} validation check(s) failed.\n`);
    process.exit(1);
}

process.stdout.write(`\n${checks.length} validation checks passed.\n`);
