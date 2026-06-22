const express = require("express");
const router = express.Router();

const store = require("../data/store");
const {
  generateDynamicFactors,
  handleRouteError,
} = require("../services/legacyService");

router.post("/", (req, res) => {
  try {
    const birthDate = req.body.birthDate;
    const result = generateDynamicFactors(store.data, birthDate);

    store.latestGenerated = result;

    res.json(result);
  } catch (error) {
    handleRouteError(error, res);
  }
});

module.exports = router;
