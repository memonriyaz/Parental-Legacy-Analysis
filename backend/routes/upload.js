const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");

const store = require("../data/store");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Excel file is required",
    });
  }

  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  store.data = jsonData;
  store.latestGenerated = null;

  res.json({
    message: "Uploaded",
    sheetName,
    rows: jsonData.length,
  });
});

module.exports = router;
