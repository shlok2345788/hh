"use client";

import { useState } from "react";
import Link from "next/link";

interface PriorityAction {
  issue: string;
  impact: "High" | "Medium" | "Low";
  fix: string;
}

interface Competitor {
  name: string;
  url: string;
  reason: string;
}

interface AuditReport {
  url: string;
  industry?: string;
  niche?: string;
  target_audience?: string;
  keywords?: string[];
  competitors?: Competitor[];
  comparison?: string[];
  conversion_issues?: string[];
  language_analysis?: {
    primary: string;
    secondary: string[];
    multilingual: boolean;
    hreflang_issue: string;
  };
  security?: {
    score: number;
    critical: string[];
    warnings: string[];
  };
  priority_actions?: PriorityAction[];
  performance?: {
    loadTimeMs: number;
    resourceCount: number;
    transferSize: number;
  };
  seo?: {
    title: string;
    metaDescription: string;
    h1Count: number;
    imageCount: number;
    imagesWithoutAlt: number;
  };
  accessibility?: {
    violations: number;
    passes: number;
  };
  analytics?: {
    hasGA: boolean;
    hasGTM: boolean;
    hasFBPixel: boolean;
    trackingPixels: string[];
  };
  roi?: {
    monthlyTraffic?: number;
    conversionRate?: number;
    revenueImpact?: number;
    reason?: string;
  } | null;
  error?: string;
}

const impactColor: Record<string, string> = {
  High: "text-red-400 bg-red-950 border-red-800",
  Medium: "text-yellow-400 bg-yellow-950 border-yellow-800",
  Low: "text-green-400 bg-green-950 border-green-800",
};

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState("");

  async function runAudit() {
    setError("");
    setReport(null);

    let target = url.trim();
    if (!target) {
      setError("Please enter a URL.");
      return;
    }
    if (!/^https?:\/\//i.test(target)) {
      target = "https://" + target;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Audit failed. Please try again.");
      } else {
        setReport(data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          ⚡ SiteBlitz
        </Link>
        <span className="text-zinc-400 text-sm">Live Website Auditor</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Live Audit</h1>
        <p className="text-zinc-400 mb-8">
          Enter any URL to run a full live audit — performance, SEO, security, and AI insights.
        </p>

        {/* Input */}
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && runAudit()}
            placeholder="https://example.com"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            onClick={runAudit}
            disabled={loading}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors whitespace-nowrap"
          >
            {loading ? "Auditing…" : "Audit Live"}
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Running live audit — this may take up to 60 seconds…</p>
          </div>
        )}

        {/* Results */}
        {report && !loading && (
          <div className="space-y-6 mt-8">
            {/* Header */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{report.url}</h2>
                  <p className="text-zinc-400 text-sm">
                    {report.industry && <span className="mr-4">Industry: <strong className="text-white">{report.industry}</strong></span>}
                    {report.niche && <span>Niche: <strong className="text-white">{report.niche}</strong></span>}
                  </p>
                </div>
                {report.security && (
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${report.security.score >= 70 ? "text-green-400" : report.security.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                      {report.security.score}/100
                    </div>
                    <div className="text-zinc-400 text-xs">Security Score</div>
                  </div>
                )}
              </div>
              {report.target_audience && (
                <p className="text-zinc-400 text-sm mt-3">Target Audience: <span className="text-white">{report.target_audience}</span></p>
              )}
            </div>

            {/* Performance & SEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.performance && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">⚡ Performance</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Load Time</dt>
                      <dd className="text-white font-medium">{(report.performance.loadTimeMs / 1000).toFixed(2)}s</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Resources</dt>
                      <dd className="text-white font-medium">{report.performance.resourceCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Transfer Size</dt>
                      <dd className="text-white font-medium">{(report.performance.transferSize / 1024).toFixed(0)} KB</dd>
                    </div>
                  </dl>
                </div>
              )}

              {report.seo && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">🔍 SEO</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Title</dt>
                      <dd className="text-white font-medium truncate max-w-[200px]">{report.seo.title || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">H1 Tags</dt>
                      <dd className="text-white font-medium">{report.seo.h1Count}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Images</dt>
                      <dd className="text-white font-medium">{report.seo.imageCount} ({report.seo.imagesWithoutAlt} missing alt)</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Accessibility & Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.accessibility && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">♿ Accessibility</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Violations</dt>
                      <dd className={`font-medium ${report.accessibility.violations > 0 ? "text-red-400" : "text-green-400"}`}>
                        {report.accessibility.violations}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Passes</dt>
                      <dd className="text-green-400 font-medium">{report.accessibility.passes}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {report.analytics && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">📊 Analytics Detected</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {report.analytics.hasGA && <span className="px-2 py-1 bg-blue-950 border border-blue-800 rounded text-blue-300">Google Analytics</span>}
                    {report.analytics.hasGTM && <span className="px-2 py-1 bg-orange-950 border border-orange-800 rounded text-orange-300">Google Tag Manager</span>}
                    {report.analytics.hasFBPixel && <span className="px-2 py-1 bg-blue-950 border border-blue-800 rounded text-blue-300">Facebook Pixel</span>}
                    {!report.analytics.hasGA && !report.analytics.hasGTM && !report.analytics.hasFBPixel && (
                      <span className="text-zinc-500">No common analytics detected</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Security */}
            {report.security && (report.security.critical.length > 0 || report.security.warnings.length > 0) && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">🔒 Security</h3>
                {report.security.critical.length > 0 && (
                  <div className="mb-3">
                    <p className="text-red-400 text-xs font-medium uppercase tracking-wide mb-2">Critical</p>
                    <ul className="space-y-1">
                      {report.security.critical.map((c, i) => (
                        <li key={i} className="text-sm text-zinc-300">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {report.security.warnings.length > 0 && (
                  <div>
                    <p className="text-yellow-400 text-xs font-medium uppercase tracking-wide mb-2">Warnings</p>
                    <ul className="space-y-1">
                      {report.security.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-zinc-300">• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Keywords */}
            {report.keywords && report.keywords.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">🏷️ Detected Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywords.map((kw) => (
                    <span key={kw} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300 text-sm">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Competitors */}
            {report.competitors && report.competitors.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">⚔️ Potential Competitors</h3>
                <div className="space-y-3">
                  {report.competitors.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-zinc-500 mt-0.5">{i + 1}.</span>
                      <div>
                        <span className="text-white font-medium">{c.name}</span>
                        <span className="text-zinc-500 mx-2">·</span>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">{c.url}</a>
                        {c.reason && <p className="text-zinc-400 mt-1">{c.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Issues */}
            {report.conversion_issues && report.conversion_issues.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">🎯 Conversion Issues</h3>
                <ul className="space-y-2">
                  {report.conversion_issues.map((issue, i) => (
                    <li key={i} className="text-sm text-zinc-300">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Priority Actions */}
            {report.priority_actions && report.priority_actions.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">🚀 Priority Actions</h3>
                <div className="space-y-4">
                  {report.priority_actions.map((action, i) => (
                    <div key={i} className="border border-zinc-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">{action.issue}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${impactColor[action.impact] || impactColor.Low}`}>
                          {action.impact}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm">{action.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROI */}
            {report.roi && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">💰 ROI Impact</h3>
                {report.roi.reason ? (
                  <p className="text-zinc-400 text-sm">{report.roi.reason}</p>
                ) : (
                  <dl className="grid grid-cols-3 gap-4 text-center">
                    {report.roi.monthlyTraffic != null && (
                      <div>
                        <dd className="text-2xl font-bold text-violet-400">{report.roi.monthlyTraffic.toLocaleString()}</dd>
                        <dt className="text-zinc-400 text-xs mt-1">Est. Monthly Traffic</dt>
                      </div>
                    )}
                    {report.roi.conversionRate != null && Number.isFinite(report.roi.conversionRate) && (
                      <div>
                        <dd className="text-2xl font-bold text-violet-400">{report.roi.conversionRate.toFixed(2)}%</dd>
                        <dt className="text-zinc-400 text-xs mt-1">Conversion Rate</dt>
                      </div>
                    )}
                    {report.roi.revenueImpact != null && (
                      <div>
                        <dd className="text-2xl font-bold text-green-400">${report.roi.revenueImpact.toLocaleString()}</dd>
                        <dt className="text-zinc-400 text-xs mt-1">Revenue Impact</dt>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
