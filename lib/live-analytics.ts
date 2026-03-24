export interface AnalyticsSignals {
  hasGA: boolean;
  hasGTM: boolean;
  hasFBPixel: boolean;
  trackingPixels: string[];
}

export function extractAnalyticsSignals(html: string): AnalyticsSignals {
  const trackingPixels: string[] = [];

  const hasGA =
    /google-analytics\.com\/analytics\.js/i.test(html) ||
    /googletagmanager\.com\/gtag\/js/i.test(html) ||
    /gtag\s*\(\s*['"]config['"]/i.test(html) ||
    /UA-\d{4,}-\d+/i.test(html) ||
    /G-[A-Z0-9]{6,}/i.test(html);

  const hasGTM =
    /googletagmanager\.com\/gtm\.js/i.test(html) ||
    /GTM-[A-Z0-9]{4,}/i.test(html);

  const hasFBPixel =
    /connect\.facebook\.net\/.*\/fbevents\.js/i.test(html) ||
    /fbq\s*\(\s*['"]init['"]/i.test(html);

  if (hasGA) trackingPixels.push("Google Analytics");
  if (hasGTM) trackingPixels.push("Google Tag Manager");
  if (hasFBPixel) trackingPixels.push("Facebook Pixel");

  // Additional common pixels
  if (/snap\.licdn\.com/i.test(html) || /linkedin\.com\/insight/i.test(html)) {
    trackingPixels.push("LinkedIn Insight");
  }
  if (/static\.ads-twitter\.com/i.test(html) || /twq\s*\(/i.test(html)) {
    trackingPixels.push("Twitter/X Ads");
  }
  if (/tiktok\.com\/i18n\/pixel/i.test(html) || /ttq\.track/i.test(html)) {
    trackingPixels.push("TikTok Pixel");
  }
  if (/hotjar\.com\/c\/hotjar/i.test(html) || /hj\s*\(.*hotjar/i.test(html)) {
    trackingPixels.push("Hotjar");
  }

  return { hasGA, hasGTM, hasFBPixel, trackingPixels };
}
