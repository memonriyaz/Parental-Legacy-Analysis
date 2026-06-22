const express = require("express");
const router = express.Router();

const chartService = require("../services/chartService");
const store = require("../data/store");
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

    const barChart = await chartService.createBarChart(result.factors);
    const pieChart = await chartService.createPieChart(
      result.motherTotal,
      result.fatherTotal,
    );

    res.json({
      birthDate: result.birthDate,
      barChart,
      pieChart,
    });
  } catch (error) {
    handleRouteError(error, res);
  }
});

module.exports = router;
