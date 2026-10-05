import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const pages = [
  "index.html",
  "longview_homepage_v8.html",
  "longview_who-we-serve.html",
  "longview_services.html",
  "longview_process.html",
  "longview_team.html",
  "longview_advisor-profile.html",
  "longview_advisor-profile-esposito.html",
  "longview_advisor-profile-holmes.html",
  "longview_blog.html",
  "longview_blog-post.html",
  "longview_post-whole-life-trap.html",
  "longview_post-first-year-attending.html",
  "longview_post-tax-planning.html",
  "longview_post-burnout-number.html",
  "longview_post-work-optional.html",
  "longview_post-comprehensive-planning.html",
  "longview_post-coordinate-accounts.html",
  "longview_post-planning-windows.html",
  "longview_post-pre-rmd-tax-window.html",
  "longview_post-retire-at-60.html",
  "longview_landing-pslf.html",
  "longview_post-assessment.html",
  "longview_vsl.html",
  "longview_book.html",
  "longview_licensing.html",
  "longview_icp-earlycareer.html",
  "longview_icp-laterstage.html",
  "longview_icp-diy.html",
  "longview_not-a-physician.html",
  "404.html",
];

const failures = [];
const checkedReferences = new Set();
const htmlRefPattern = /(?:^|\s)(?:href|src|poster|data-src|data-src-mobile|data-poster-mobile)=["']([^"'<>]+)["']/gi;
const cssRefPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function isExternal(raw) {
  return /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw);
}

function localTarget(sourceFile, raw) {
  const [pathAndQuery, fragment = ""] = raw.split("#", 2);
  const clean = decodeURIComponent(pathAndQuery.split("?", 1)[0]);
  const sourceDirectory = dirname(join(root, sourceFile));
  const target = clean.startsWith("/")
    ? normalize(join(root, clean.slice(1)))
    : normalize(join(sourceDirectory, clean || sourceFile.split(sep).at(-1)));
  return { target, fragment };
}

async function checkReference(sourceFile, raw) {
  if (!raw || isExternal(raw)) return;
  const key = `${sourceFile}\0${raw}`;
  if (checkedReferences.has(key)) return;
  checkedReferences.add(key);

  const { target, fragment } = localTarget(sourceFile, raw);
  const resolvedRoot = resolve(root) + sep;
  const resolvedTarget = resolve(target);
  if (!resolvedTarget.startsWith(resolvedRoot)) {
    fail(sourceFile, `reference escapes the public root: ${raw}`);
    return;
  }
  if (!(await exists(resolvedTarget))) {
    fail(sourceFile, `missing local reference ${raw}`);
    return;
  }
  if (fragment && extname(resolvedTarget).toLowerCase() === ".html") {
    const targetHtml = await readFile(resolvedTarget, "utf8");
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`(?:id|name)=["']${escaped}["']`).test(targetHtml)) {
      fail(sourceFile, `missing fragment target ${raw}`);
    }
  }
}

for (const page of pages) {
  const pagePath = join(root, page);
  if (!(await exists(pagePath))) {
    fail(page, "missing required page");
    continue;
  }
  const html = await readFile(pagePath, "utf8");
  const renderedHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  if (!/<meta\s+name=["']viewport["']/i.test(html)) fail(page, "missing viewport metadata");
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(page, "missing title");
  if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) fail(page, "must contain exactly one H1");
  for (const match of renderedHtml.matchAll(htmlRefPattern)) await checkReference(page, match[1]);
}

const assetDirectory = join(root, "assets");
for (const file of await readdir(assetDirectory)) {
  if (extname(file).toLowerCase() !== ".css") continue;
  const sourceFile = join("assets", file);
  const css = await readFile(join(root, sourceFile), "utf8");
  for (const match of css.matchAll(cssRefPattern)) await checkReference(sourceFile, match[1]);
}

const home = await readFile(join(root, "index.html"), "utf8");
const alias = await readFile(join(root, "longview_homepage_v8.html"), "utf8");
if (home !== alias) fail("index.html", "must match longview_homepage_v8.html");

for (const required of [
  "Physicians at every career stage have one question:",
  "Take the Assessment",
  "The Wealth Care Guide",
  "The Team That Serves You",
  "will-holmes.jpg",
]) {
  if (!home.includes(required)) fail("index.html", `missing approved homepage content: ${required}`);
}

const team = await readFile(join(root, "longview_team.html"), "utf8");
if (!team.includes('src="images/will-holmes.jpg"')) fail("longview_team.html", "missing Will Holmes portrait");
if (!team.includes("Lauren Clarke")) fail("longview_team.html", "missing Lauren Clarke card");

const replit = await readFile(join(root, ".replit"), "utf8");
if (!/deploymentTarget\s*=\s*["']static["']/.test(replit)) fail(".replit", "must use a static deployment");
if (!/publicDir\s*=\s*["']\.["']/.test(replit)) fail(".replit", "publicDir must be the repository root");
if (!/X-Robots-Tag/.test(replit) || !/noindex, nofollow/.test(replit)) {
  fail(".replit", "review deployment must stay noindex until launch blockers are cleared");
}

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!/Disallow:\s*\//i.test(robots)) fail("robots.txt", "review deployment must disallow crawling");

const blockerPatterns = [
  /COMPLIANCE PLACEHOLDER/gi,
  /CRN_+/g,
  /VIDEO EMBED/gi,
  /Calendly placeholder/gi,
];
let blockerCount = 0;
for (const page of pages.filter((page) => page !== "404.html")) {
  const html = await readFile(join(root, page), "utf8");
  for (const pattern of blockerPatterns) blockerCount += (html.match(pattern) || []).length;
}

if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s)`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`PASS — ${pages.length} pages and ${checkedReferences.size} local references verified.`);
console.log(`NOTICE — ${blockerCount} launch-blocker markers remain; keep review-mode crawler protections enabled.`);
