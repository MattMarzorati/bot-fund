import { chromium } from "playwright";

export async function fetchIbgtPremiumPct(): Promise<number> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto("https://furthermore.app/bgt/derivatives", {
      waitUntil: "networkidle",
      timeout: 60_000
    });

    const bodyText = await page.locator("body").innerText();

    const line = bodyText
      .split("\n")
      .map((x) => x.trim())
      .find((x) => /premium/i.test(x) && /%/.test(x));

    const source = line ?? bodyText;
    const match = source.match(/([+-]?\d+(?:\.\d+)?)\s*%/);

    if (!match) {
      throw new Error("Could not parse iBGT premium from page content");
    }

    return Number(match[1]);
  } finally {
    await browser.close();
  }
}
