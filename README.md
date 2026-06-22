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

![Dashboard workflow](https://github.com/user-attachments/assets/1fb2c513-175d-424c-bb29-fa1e20341776)

### Charts

![Generated totals and charts](https://github.com/user-attachments/assets/0aff9a6a-f772-4691-ad68-3e2303a20488)

### Generated Factors

![Generated factors table](https://github.com/user-attachments/assets/70e5423e-ecbf-4e41-8b6a-15ec1fe08bab)

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

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   cd backend && npm install && cd ../frontend && npm install
   ```

2. **Start the backend:**

   ```bash
   cd backend
   npm start
   ```

3. **Start the frontend (new terminal):**

   ```bash
   cd frontend
   npm run dev
   ```

4. **Upload baseline Excel file** via the dashboard UI

5. **Select a birth date** and generate values

6. **Download the PDF report** with visualizations

## API Documentation

All API endpoints run on `http://localhost:3000`.

### 1. `POST /upload`

Uploads and parses the baseline Excel file.

**Request:**

- Form-data with `file` (Excel file)

**Response:**

```json
{
  "message": "Uploaded",
  "sheetName": "Sheet1",
  "rows": 9
}
```

**Example:**

```bash
curl -F "file=@Test.xlsx" http://localhost:3000/upload
```

---

### 2. `GET /analyze`

Analyzes the uploaded baseline file to validate totals and identify key statistics.

**Response:**

```json
{
  "valid": true,
  "motherTotal": 50.0,
  "fatherTotal": 50.0,
  "total": 100.0,
  "motherHighest": "Leadership",
  "motherLowest": "Creativity",
  "fatherHighest": "Intelligence",
  "fatherLowest": "Integrity",
  "factors": [
    {
      "name": "Leadership",
      "mother": 8.5,
      "father": 7.2
    }
  ]
}
```

**Example:**

```bash
curl http://localhost:3000/analyze
```

---

### 3. `POST /generate`

Generates new Mother/Father values based on birth date, applying the odd/even date rule.

**Request:**

```json
{
  "birthDate": "1990-03-15"
}
```

**Response:**

```json
{
  "birthDate": "1990-03-15",
  "motherTotal": 50.123,
  "fatherTotal": 49.877,
  "total": 100.0,
  "factors": [
    {
      "factor": "Leadership",
      "mother": 8.567,
      "father": 7.456
    }
  ]
}
```

**Rules:**

- Odd day (e.g., 15th): Mother values are higher
- Even day (e.g., 14th): Father values are higher
- Total is **always exactly 100.000**

**Example:**

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1990-03-15"}'
```

---

### 4. `GET /visualize`

Returns Chart.js chart data for the generated values.

**Query Parameters:**

- `birthDate` (optional): Generate and visualize for a specific date. If not provided, uses last generated data.

**Response:**

```json
{
  "birthDate": "1990-03-15",
  "barChart": {
    "labels": ["Leadership", "Intelligence", ...],
    "datasets": [
      {
        "label": "Mother",
        "data": [8.567, 7.2, ...],
        "backgroundColor": "rgba(236, 72, 153, 0.8)"
      },
      {
        "label": "Father",
        "data": [7.456, 8.1, ...],
        "backgroundColor": "rgba(59, 130, 246, 0.8)"
      }
    ]
  },
  "pieChart": {
    "labels": ["Mother", "Father"],
    "datasets": [
      {
        "data": [50.123, 49.877],
        "backgroundColor": ["rgba(236, 72, 153, 0.8)", "rgba(59, 130, 246, 0.8)"]
      }
    ]
  }
}
```

**Example:**

```bash
curl "http://localhost:3000/visualize?birthDate=1990-03-15"
```

---

### 5. `GET /report`

Generates and downloads a PDF report with tables and charts.

**Query Parameters:**

- `birthDate` (optional): Generate report for a specific date. If not provided, uses last generated data.

**Response:**

- Binary PDF file for download

**Example:**

```bash
curl "http://localhost:3000/report" -o report.pdf
```

---

## Postman Collection

Import this collection into Postman to test the API:

```json
{
  "info": {
    "name": "Parental Legacy Analysis API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Upload Excel",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/upload",
        "body": {
          "mode": "formdata",
          "formdata": [{ "key": "file", "type": "file" }]
        }
      }
    },
    {
      "name": "Analyze",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/analyze"
      }
    },
    {
      "name": "Generate",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/generate",
        "body": {
          "mode": "raw",
          "raw": "{\"birthDate\":\"1990-03-15\"}"
        }
      }
    },
    {
      "name": "Visualize",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/visualize?birthDate=1990-03-15"
      }
    },
    {
      "name": "Report",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/report"
      }
    }
  ]
}
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
