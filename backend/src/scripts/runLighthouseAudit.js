const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PAGES = [
  { name: 'Home', url: 'http://localhost:5173/' },
  { name: 'Courses', url: 'http://localhost:5173/courses' },
  { name: 'Course_Details', url: 'http://localhost:5173/courses/applied-data-analytics-power-bi' },
];

const results = {};
const outputDir = path.resolve(__dirname, 'lighthouse_results');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const page of PAGES) {
  // 1. Mobile Lighthouse
  console.log(`Running Mobile Lighthouse on [${page.name}]...`);
  const mobileFile = path.join(outputDir, `${page.name}_mobile.json`);
  try {
    execSync(
      `npx lighthouse ${page.url} --output=json --output-path="${mobileFile}" --chrome-flags="--headless --no-sandbox" --quiet`,
      { stdio: 'inherit', timeout: 90000 }
    );
    const data = JSON.parse(fs.readFileSync(mobileFile, 'utf8'));
    results[`${page.name}_mobile`] = {
      performance: Math.round(data.categories.performance.score * 100),
      accessibility: Math.round(data.categories.accessibility.score * 100),
      bestPractices: Math.round(data.categories['best-practices'].score * 100),
      seo: Math.round(data.categories.seo.score * 100),
      fcp: data.audits['first-contentful-paint'].displayValue,
      lcp: data.audits['largest-contentful-paint'].displayValue,
      tbt: data.audits['total-blocking-time'].displayValue,
      cls: data.audits['cumulative-layout-shift'].displayValue,
      speedIndex: data.audits['speed-index'].displayValue,
      opportunities: Object.values(data.audits)
        .filter((a) => a.details && a.details.type === 'opportunity' && a.numericValue > 50)
        .map((a) => ({
          title: a.title,
          savingsMs: Math.round(a.numericValue),
          displayValue: a.displayValue,
        })),
    };
  } catch (err) {
    console.error(`Mobile audit error on ${page.name}:`, err.message);
  }

  // 2. Desktop Lighthouse
  console.log(`Running Desktop Lighthouse on [${page.name}]...`);
  const desktopFile = path.join(outputDir, `${page.name}_desktop.json`);
  try {
    execSync(
      `npx lighthouse ${page.url} --preset=desktop --output=json --output-path="${desktopFile}" --chrome-flags="--headless --no-sandbox" --quiet`,
      { stdio: 'inherit', timeout: 90000 }
    );
    const data = JSON.parse(fs.readFileSync(desktopFile, 'utf8'));
    results[`${page.name}_desktop`] = {
      performance: Math.round(data.categories.performance.score * 100),
      accessibility: Math.round(data.categories.accessibility.score * 100),
      bestPractices: Math.round(data.categories['best-practices'].score * 100),
      seo: Math.round(data.categories.seo.score * 100),
      fcp: data.audits['first-contentful-paint'].displayValue,
      lcp: data.audits['largest-contentful-paint'].displayValue,
      tbt: data.audits['total-blocking-time'].displayValue,
      cls: data.audits['cumulative-layout-shift'].displayValue,
      speedIndex: data.audits['speed-index'].displayValue,
      opportunities: Object.values(data.audits)
        .filter((a) => a.details && a.details.type === 'opportunity' && a.numericValue > 50)
        .map((a) => ({
          title: a.title,
          savingsMs: Math.round(a.numericValue),
          displayValue: a.displayValue,
        })),
    };
  } catch (err) {
    console.error(`Desktop audit error on ${page.name}:`, err.message);
  }
}

const summaryPath = path.resolve(__dirname, 'lighthouseSummary.json');
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
console.log(`\n✅ Lighthouse summary saved to: ${summaryPath}`);
