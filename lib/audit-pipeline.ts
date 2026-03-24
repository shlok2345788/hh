import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

export interface AuditContent {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
  links: string[];
}

export interface AuditPerformance {
  loadTimeMs: number;
  resourceCount: number;
  transferSize: number;
}

export interface AuditSEO {
  title: string;
  metaDescription: string;
  h1Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  canonicalUrl: string;
}

export interface AuditAccessibility {
  violations: number;
  passes: number;
  violationDetails: {
    id: string;
    impact: string | null;
    description: string;
  }[];
}

export interface AuditDOM {
  totalElements: number;
  formCount: number;
  buttonCount: number;
  inputCount: number;
}

export interface AuditSecurity {
  https: boolean;
  hasCSP: boolean;
  hasHSTS: boolean;
  headers: Record<string, string>;
}

export interface AuditResult {
  url: string;
  rawHtml: string;
  content: AuditContent;
  performance: AuditPerformance;
  seo: AuditSEO;
  accessibility: AuditAccessibility;
  dom: AuditDOM;
  security: AuditSecurity;
}

export async function runAuditPipeline(url: string): Promise<AuditResult> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (compatible; SiteBlitz/1.0; +https://siteblitz.dev)",
  });
  const page = await context.newPage();

  const resourceCount = { count: 0, size: 0 };
  page.on("response", (response) => {
    resourceCount.count++;
    const length = parseInt(response.headers()["content-length"] ?? "0", 10);
    resourceCount.size += isNaN(length) ? 0 : length;
  });

  const start = Date.now();
  const response = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 30_000,
  });
  const loadTimeMs = Date.now() - start;

  const rawHtml = await page.content();

  // Security info from headers
  const headers: Record<string, string> = {};
  if (response) {
    for (const [k, v] of Object.entries(response.headers())) {
      headers[k.toLowerCase()] = v;
    }
  }

  const security: AuditSecurity = {
    https: url.startsWith("https://"),
    hasCSP: "content-security-policy" in headers,
    hasHSTS: "strict-transport-security" in headers,
    headers,
  };

  // Content extraction
  const extracted = await page.evaluate(() => {
    const title = document.title;
    const metaDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
      .slice(0, 30)
      .map((h) => h.textContent?.trim() ?? "");
    const bodyText = (document.body?.innerText ?? "").slice(0, 3000);
    const links = Array.from(document.querySelectorAll("a[href]"))
      .slice(0, 50)
      .map((a) => (a as HTMLAnchorElement).href);
    const images = Array.from(document.querySelectorAll("img"));
    const imagesWithoutAlt = images.filter((img) => !img.alt).length;
    const h1Count = document.querySelectorAll("h1").length;
    const canonicalUrl =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    const totalElements = document.querySelectorAll("*").length;
    const formCount = document.querySelectorAll("form").length;
    const buttonCount = document.querySelectorAll("button").length;
    const inputCount = document.querySelectorAll("input").length;

    return {
      title,
      metaDescription,
      headings,
      bodyText,
      links,
      imageCount: images.length,
      imagesWithoutAlt,
      h1Count,
      canonicalUrl,
      totalElements,
      formCount,
      buttonCount,
      inputCount,
    };
  });

  // Accessibility via axe-core
  let accessibilityResult: AuditAccessibility = {
    violations: 0,
    passes: 0,
    violationDetails: [],
  };
  try {
    const axeResults = await new AxeBuilder({ page }).analyze();
    accessibilityResult = {
      violations: axeResults.violations.length,
      passes: axeResults.passes.length,
      violationDetails: axeResults.violations.slice(0, 10).map((v) => ({
        id: v.id,
        impact: v.impact ?? null,
        description: v.description,
      })),
    };
  } catch {
    // axe failure is non-fatal
  }

  await browser.close();

  const content: AuditContent = {
    title: extracted.title,
    metaDescription: extracted.metaDescription,
    headings: extracted.headings,
    bodyText: extracted.bodyText,
    links: extracted.links,
  };

  const performance: AuditPerformance = {
    loadTimeMs,
    resourceCount: resourceCount.count,
    transferSize: resourceCount.size,
  };

  const seo: AuditSEO = {
    title: extracted.title,
    metaDescription: extracted.metaDescription,
    h1Count: extracted.h1Count,
    imageCount: extracted.imageCount,
    imagesWithoutAlt: extracted.imagesWithoutAlt,
    canonicalUrl: extracted.canonicalUrl,
  };

  const dom: AuditDOM = {
    totalElements: extracted.totalElements,
    formCount: extracted.formCount,
    buttonCount: extracted.buttonCount,
    inputCount: extracted.inputCount,
  };

  return {
    url,
    rawHtml,
    content,
    performance,
    seo,
    accessibility: accessibilityResult,
    dom,
    security,
  };
}
