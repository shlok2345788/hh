import { NextRequest, NextResponse } from "next/server";
import { runAuditPipeline } from "@/lib/audit-pipeline";
import { extractAnalyticsSignals } from "@/lib/live-analytics";
import { analyzeWithAI } from "@/lib/ai-engine";
import { computeROI } from "@/lib/roi";
import { saveAudit } from "@/lib/live-database";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawUrl = (body.url ?? "").trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only http/https allowed");
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const targetUrl = parsedUrl.toString();

  // Run audit pipeline
  let auditData;
  try {
    auditData = await runAuditPipeline(targetUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Audit pipeline failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Extract analytics signals from raw HTML
  const analytics = extractAnalyticsSignals(auditData.rawHtml ?? "");

  // Run AI analysis
  let aiInsights: Awaited<ReturnType<typeof analyzeWithAI>> | null = null;
  try {
    aiInsights = await analyzeWithAI({
      content: auditData.content,
      performance: auditData.performance,
      seo: auditData.seo,
      accessibility: auditData.accessibility,
      dom: auditData.dom,
      security: auditData.security,
    });
  } catch {
    // AI is optional — continue without it
  }

  // Compute ROI
  const roi = computeROI(analytics, auditData.performance);

  // Persist audit
  try {
    await saveAudit({
      url: targetUrl,
      auditData,
      analytics,
      aiInsights,
      roi,
    });
  } catch {
    // DB is optional — continue without it
  }

  return NextResponse.json({
    url: targetUrl,
    performance: auditData.performance,
    seo: auditData.seo,
    accessibility: auditData.accessibility,
    analytics,
    roi,
    ...(aiInsights ?? {}),
  });
}
