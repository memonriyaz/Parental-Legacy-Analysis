const express = require("express");

const uploadRoute = require("./routes/upload");
const analyzeRoute = require("./routes/analyze");
const generateRoute = require("./routes/generate");
const visualizeRoute = require("./routes/visualize");
const reportRoute = require("./routes/report");

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);



app.use("/upload", uploadRoute);
app.use("/analyze", analyzeRoute);
app.use("/generate", generateRoute);
app.use("/visualize", visualizeRoute);
app.use("/report", reportRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
