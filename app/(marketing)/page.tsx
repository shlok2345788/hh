import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <span className="text-xl font-bold text-white tracking-tight">
          ⚡ SiteBlitz
        </span>
        <Link
          href="/audit"
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors"
        >
          Start Audit
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-950 border border-violet-700 rounded-full text-violet-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          AI-Powered · Live Analysis
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight">
          Audit Any Website.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Instantly.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10">
          SiteBlitz runs a live, full-stack audit — performance, SEO, accessibility,
          security — and surfaces AI-generated insights, competitor gaps, and ROI
          impact in seconds.
        </p>
        <Link
          href="/audit"
          className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-lg transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50"
        >
          Run a Free Audit →
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: "⚡",
            title: "Performance",
            desc: "Core Web Vitals, load time, resource breakdown, and Lighthouse scores.",
          },
          {
            icon: "🔍",
            title: "SEO",
            desc: "Meta tags, headings, keywords, structured data, and indexability.",
          },
          {
            icon: "🔒",
            title: "Security",
            desc: "HTTPS status, CSP headers, vulnerability indicators, and risk score.",
          },
          {
            icon: "🤖",
            title: "AI Insights",
            desc: "Industry detection, competitor gaps, conversion issues, priority fixes.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-violet-700 transition-colors"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to see the truth about any website?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl">
          Enter any URL and get a full audit with AI recommendations in under 60 seconds.
        </p>
        <Link
          href="/audit"
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-xl text-white font-semibold text-lg transition-all"
        >
          Audit Live Now →
        </Link>
      </section>

      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} SiteBlitz. All rights reserved.
      </footer>
    </main>
  );
}
