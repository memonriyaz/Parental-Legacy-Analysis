const express = require("express");
const router = express.Router();

const store = require("../data/store");
const {
  handleRouteError,
  normalizeFactors,
  summarizeFactors,
} = require("../services/legacyService");

router.get("/", (req, res) => {
  try {
    const factors = normalizeFactors(store.data);
    const summary = summarizeFactors(factors);

    res.json({
      message: summary.validTotal
        ? "Baseline data is valid"
        : "Baseline data total is not exactly 100.000",
      ...summary,
    });
  } catch (error) {
    handleRouteError(error, res);
  }
});

module.exports = router;
