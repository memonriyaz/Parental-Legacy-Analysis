const express = require("express");
const router = express.Router();

const store = require("../data/store");

const chartService = require("../services/chartService");

const generatePDF = require("../services/pdfService");
const {
  generateDynamicFactors,
  handleRouteError,
} = require("../services/legacyService");

router.get("/", async (req, res) => {
  try {
    const result = req.query.birthDate
      ? generateDynamicFactors(store.data, req.query.birthDate)
      : store.latestGenerated;

    if (!result) {
      return res.status(400).json({
        message: "Generate data first or pass ?birthDate=YYYY-MM-DD",
      });
    }

    await chartService.createBarChart(result.factors);
    await chartService.createPieChart(result.motherTotal, result.fatherTotal);

    const file = await generatePDF(result);

    res.download(file);
  } catch (error) {
    handleRouteError(error, res);
  }
});

module.exports = router;
