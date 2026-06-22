# Parental Legacy Analysis

Full-stack MERN project for dynamically generating Parental Legacy Analysis values from an uploaded Excel baseline.

## What It Does

- Uploads and parses the provided Excel file.
- Validates the uploaded baseline totals.
- Generates new 7-factor Mother/Father values from a `birthDate`.
- Applies the required odd/even date rule:
  - Odd day: Mother values are higher.
  - Even day: Father values are higher.
- Guarantees the generated total is exactly `100.000`.
- Returns visual chart data.
- Generates a downloadable backend PDF report.
- Includes a simple React dashboard for upload, date input, dynamic charts, and PDF download.

## Screenshots

### Workflow

![Dashboard workflow](docs/screenshots/dashboard-workflow.png)

### Charts

![Generated totals and charts](docs/screenshots/generated-charts.png)

### Generated Factors

![Generated factors table](docs/screenshots/generated-factors.png)

## Setup

Install dependencies from the root, backend, and frontend folders if needed:

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
```

Run the backend:

```bash
cd backend
npm start
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

Backend runs on `http://localhost:3000`.

## API Documentation

### `POST /upload`

Uploads the baseline Excel file.

Form-data:

| Key | Type | Description |
| --- | --- | --- |
| `file` | File | Excel file, such as `Test.xlsx` |

Example response:

```json
{
  "message": "Uploaded",
  "sheetName": "Sheet1",
  "rows": 9
}
```

### `GET /analyze`

Analyzes the uploaded baseline file.

Returns:

- Whether uploaded totals equal exactly `100.000`.
- Mother total, Father total, and overall total.
- Highest and lowest contributing factor for Mother and Father.
- Structured Mother vs Father comparison across all factors.

Example:

```bash
curl http://localhost:3000/analyze
```

### `POST /generate`

Generates a new dynamic factor set from birth date.

Request:

```json
{
  "birthDate": "1995-04-12"
}
```

Example response:

```json
{
  "birthDate": "1995-04-12",
  "ruleApplied": "Even date: Father values are higher",
  "motherTotal": 39.999,
  "fatherTotal": 60.001,
  "total": 100,
  "factors": [
    {
      "factor": "Example Factor",
      "mother": 4.5,
      "father": 6.75,
      "higher": "Father"
    }
  ]
}
```

### `GET /visualize`

Returns visual chart data as base64 SVG data URLs.

Use the latest generated data:

```bash
curl http://localhost:3000/visualize
```

Or generate visuals for a date:

```bash
curl "http://localhost:3000/visualize?birthDate=1995-04-12"
```

Response includes:

- `barChart.dataUrl`
- `pieChart.dataUrl`

### `GET /report`

Downloads a PDF report with generated values and visual charts.

Use latest generated data:

```bash
curl -o report.pdf http://localhost:3000/report
```

Or generate report for a date:

```bash
curl -o report.pdf "http://localhost:3000/report?birthDate=1995-04-12"
```

## Floating-Point Math Approach

The generated values are not balanced using raw JavaScript floating-point arithmetic.

Instead, the generator converts the target total into integer thousandths:

```text
100.000 = 100000 units
```

Each factor receives an integer number of units. Mother and Father values are also assigned as integer units, so there is no binary floating-point drift during the balancing step.

Only at the response boundary are units formatted back into three-decimal numbers:

```text
4250 units = 4.250
```

Because all generated factor units always sum to exactly `100000`, the response total is guaranteed to be exactly `100.000`.

## Notes

- The backend stores uploaded Excel data in memory for this assignment.
- Upload the Excel file before calling `/analyze`, `/generate`, `/visualize`, or `/report`.
- `/visualize` and `/report` can use the latest generated data or accept `birthDate` as a query parameter.
