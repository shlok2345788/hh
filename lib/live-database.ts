import type { AnalyticsSignals } from "./live-analytics";
import type { AIInsights } from "./ai-engine";
import type { AuditResult } from "./audit-pipeline";
import type { ROIResult } from "./roi";

interface SaveAuditParams {
  url: string;
  auditData: AuditResult;
  analytics: AnalyticsSignals;
  aiInsights: AIInsights | null;
  roi: ROIResult | null;
}

export async function saveAudit(params: SaveAuditParams): Promise<void> {
  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    return; // gracefully skip if not configured
  }

  try {
    const { sql } = await import("@vercel/postgres");
    await sql`
      CREATE TABLE IF NOT EXISTS audits (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        audit_data JSONB,
        analytics JSONB,
        ai_insights JSONB,
        roi JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO audits (url, audit_data, analytics, ai_insights, roi)
      VALUES (
        ${params.url},
        ${JSON.stringify(params.auditData)},
        ${JSON.stringify(params.analytics)},
        ${JSON.stringify(params.aiInsights)},
        ${JSON.stringify(params.roi)}
      )
    `;
  } catch {
    // DB errors are non-fatal
  }
}
