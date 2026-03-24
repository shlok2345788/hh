export interface AuditInput {
  content: unknown;
  performance: unknown;
  seo: unknown;
  accessibility: unknown;
  dom: unknown;
  security: unknown;
}

export interface AIInsights {
  industry: string;
  niche: string;
  target_audience: string;
  keywords: string[];
  competitors: { name: string; url: string; reason: string }[];
  comparison: string[];
  conversion_issues: string[];
  language_analysis: {
    primary: string;
    secondary: string[];
    multilingual: boolean;
    hreflang_issue: string;
  };
  security: {
    score: number;
    critical: string[];
    warnings: string[];
  };
  priority_actions: {
    issue: string;
    impact: "High" | "Medium" | "Low";
    fix: string;
  }[];
}

export async function analyzeWithAI(input: AuditInput): Promise<AIInsights> {
  const host = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "qwen2.5:3b-instruct";

  const systemPrompt = `You are an advanced AI Website Intelligence Engine. Analyze the provided website audit data and generate deep insights.

Website Content: ${JSON.stringify(input.content)}
Performance Metrics: ${JSON.stringify(input.performance)}
SEO Data: ${JSON.stringify(input.seo)}
Accessibility Data: ${JSON.stringify(input.accessibility)}
DOM/Structure: ${JSON.stringify(input.dom)}
Security Data: ${JSON.stringify(input.security)}

Return ONLY valid JSON with this exact structure:
{
  "industry": "",
  "niche": "",
  "target_audience": "",
  "keywords": [],
  "competitors": [{"name":"","url":"","reason":""}],
  "comparison": [""],
  "conversion_issues": [""],
  "language_analysis": {"primary":"","secondary":[],"multilingual":true,"hreflang_issue":""},
  "security": {"score":0,"critical":[],"warnings":[]},
  "priority_actions": [{"issue":"","impact":"High|Medium|Low","fix":""}]
}`;

  const timeoutMs = parseInt(process.env.OLLAMA_TIMEOUT_MS ?? "120000", 10);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${host}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: systemPrompt,
        stream: false,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { response?: string };
  const raw = (data.response ?? "").trim();

  // Extract JSON from the response (handle markdown fences)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  return JSON.parse(jsonMatch[0]) as AIInsights;
}
