const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDF(result) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const reportsDirectory = path.join(__dirname, "..", "reports");
    const filePath = path.join(reportsDirectory, "report.pdf");

    fs.mkdirSync(reportsDirectory, { recursive: true });

    const stream = fs.createWriteStream(filePath);
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);

    doc.pipe(stream);

    doc.fontSize(20).text("Parental Legacy Report", { underline: true });

    doc.moveDown();

    if (result.birthDate) {
      doc.fontSize(12).text(`Birth Date : ${result.birthDate}`);
    }

    if (result.ruleApplied) {
      doc.text(`Rule Applied : ${result.ruleApplied}`);
    }

    doc.fontSize(14).text(`Mother Total : ${result.motherTotal}`);
    doc.text(`Father Total : ${result.fatherTotal}`);
    doc.text(`Overall Total : ${result.total}`);

    doc.moveDown();
    doc.fontSize(16).text("Factor Values");
    doc.moveDown(0.5);

    result.factors.forEach((factor) => {
      doc
        .fontSize(11)
        .text(`${factor.factor}: Mother ${factor.mother} | Father ${factor.father}`);
    });

    doc.addPage();
    drawBarChart(doc, result.factors);

    doc.addPage();
    drawPieChart(doc, result.motherTotal, result.fatherTotal);

    doc.end();
  });
}

function drawBarChart(doc, factors) {
  const x = 50;
  const y = 90;
  const width = 500;
  const height = 280;
  const maxValue = Math.max(...factors.flatMap((factor) => [factor.mother, factor.father]), 1);
  const groupWidth = width / factors.length;
  const barWidth = Math.min(20, groupWidth / 3);

  doc.fontSize(18).text("Mother vs Father Factor Comparison", x, 40);
  doc.moveTo(x, y + height).lineTo(x + width, y + height).strokeColor("#94a3b8").stroke();

  factors.forEach((factor, index) => {
    const center = x + index * groupWidth + groupWidth / 2;
    const motherHeight = (factor.mother / maxValue) * height;
    const fatherHeight = (factor.father / maxValue) * height;

    doc.rect(center - barWidth - 3, y + height - motherHeight, barWidth, motherHeight).fill("#fb7185");
    doc.rect(center + 3, y + height - fatherHeight, barWidth, fatherHeight).fill("#38bdf8");
    doc
      .fillColor("#111827")
      .fontSize(7)
      .text(factor.factor, center - groupWidth / 2 + 4, y + height + 8, {
        width: groupWidth - 8,
        align: "center",
      });
  });

  doc.fillColor("#fb7185").rect(x, 410, 10, 10).fill();
  doc.fillColor("#111827").fontSize(10).text("Mother", x + 16, 408);
  doc.fillColor("#38bdf8").rect(x + 90, 410, 10, 10).fill();
  doc.fillColor("#111827").text("Father", x + 106, 408);
}

function drawPieChart(doc, motherTotal, fatherTotal) {
  const x = 120;
  const y = 115;
  const size = 260;
  const motherWidth = (motherTotal / (motherTotal + fatherTotal)) * size;

  doc.fontSize(18).fillColor("#111827").text("Overall Total Contribution Split", 50, 40);
  doc.rect(x, y, motherWidth, size).fill("#fb7185");
  doc.rect(x + motherWidth, y, size - motherWidth, size).fill("#38bdf8");
  doc
    .fillColor("#111827")
    .fontSize(12)
    .text(`Mother: ${motherTotal.toFixed(3)}`, 420, y + 70)
    .text(`Father: ${fatherTotal.toFixed(3)}`, 420, y + 100);
}

module.exports = generatePDF;
