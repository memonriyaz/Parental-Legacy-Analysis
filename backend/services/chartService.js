const fs = require("fs");
const path = require("path");

const chartDirectory = path.join(__dirname, "..", "charts");

function ensureChartDirectory() {
  fs.mkdirSync(chartDirectory, { recursive: true });
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDataUrl(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function createBarChart(factors) {
  ensureChartDirectory();

  const width = 920;
  const height = 560;
  const padding = 70;
  const chartHeight = 360;
  const chartWidth = width - padding * 2;
  const maxValue = Math.max(...factors.flatMap((factor) => [factor.mother, factor.father]), 1);
  const groupWidth = chartWidth / factors.length;
  const barWidth = Math.min(26, groupWidth / 3);

  const bars = factors
    .map((factor, index) => {
      const x = padding + index * groupWidth + groupWidth / 2;
      const motherHeight = (factor.mother / maxValue) * chartHeight;
      const fatherHeight = (factor.father / maxValue) * chartHeight;
      const yBase = padding + chartHeight;

      return `
        <rect x="${x - barWidth - 3}" y="${yBase - motherHeight}" width="${barWidth}" height="${motherHeight}" rx="5" fill="#fb7185" />
        <rect x="${x + 3}" y="${yBase - fatherHeight}" width="${barWidth}" height="${fatherHeight}" rx="5" fill="#38bdf8" />
        <text x="${x}" y="${yBase + 26}" text-anchor="middle" font-size="11" fill="#cbd5e1">${escapeXml(factor.factor)}</text>
      `;
    })
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#0f172a" />
      <text x="${padding}" y="36" font-family="Arial" font-size="24" font-weight="700" fill="#ffffff">Mother vs Father Factor Comparison</text>
      <line x1="${padding}" y1="${padding + chartHeight}" x2="${width - padding}" y2="${padding + chartHeight}" stroke="#334155" />
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartHeight}" stroke="#334155" />
      ${bars}
      <rect x="${padding}" y="${height - 48}" width="14" height="14" rx="3" fill="#fb7185" />
      <text x="${padding + 22}" y="${height - 36}" font-family="Arial" font-size="14" fill="#cbd5e1">Mother</text>
      <rect x="${padding + 100}" y="${height - 48}" width="14" height="14" rx="3" fill="#38bdf8" />
      <text x="${padding + 122}" y="${height - 36}" font-family="Arial" font-size="14" fill="#cbd5e1">Father</text>
    </svg>
  `;

  const filePath = path.join(chartDirectory, "barChart.svg");
  fs.writeFileSync(filePath, svg);

  return {
    filePath,
    dataUrl: toDataUrl(svg),
  };
}

async function createPieChart(motherTotal, fatherTotal) {
  ensureChartDirectory();

  const width = 560;
  const height = 420;
  const radius = 135;
  const cx = 190;
  const cy = 205;
  const total = motherTotal + fatherTotal;
  const motherPercent = total === 0 ? 0 : motherTotal / total;
  const angle = motherPercent * Math.PI * 2;
  const x = cx + radius * Math.sin(angle);
  const y = cy - radius * Math.cos(angle);
  const largeArc = motherPercent > 0.5 ? 1 : 0;

  const motherPath = [
    `M ${cx} ${cy}`,
    `L ${cx} ${cy - radius}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`,
    "Z",
  ].join(" ");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#0f172a" />
      <text x="36" y="42" font-family="Arial" font-size="24" font-weight="700" fill="#ffffff">Total Contribution Split</text>
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#38bdf8" />
      <path d="${motherPath}" fill="#fb7185" />
      <circle cx="${cx}" cy="${cy}" r="72" fill="#0f172a" />
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#ffffff">${motherTotal.toFixed(3)}</text>
      <text x="${cx}" y="${cy + 20}" text-anchor="middle" font-family="Arial" font-size="13" fill="#cbd5e1">Mother</text>
      <rect x="380" y="160" width="16" height="16" rx="4" fill="#fb7185" />
      <text x="406" y="174" font-family="Arial" font-size="15" fill="#cbd5e1">Mother ${motherTotal.toFixed(3)}</text>
      <rect x="380" y="196" width="16" height="16" rx="4" fill="#38bdf8" />
      <text x="406" y="210" font-family="Arial" font-size="15" fill="#cbd5e1">Father ${fatherTotal.toFixed(3)}</text>
    </svg>
  `;

  const filePath = path.join(chartDirectory, "pieChart.svg");
  fs.writeFileSync(filePath, svg);

  return {
    filePath,
    dataUrl: toDataUrl(svg),
  };
}

module.exports = {
  createBarChart,
  createPieChart,
};
