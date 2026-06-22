const Decimal = require("decimal.js");

const TOTAL_UNITS = 100000;

function ensureUploaded(data) {
  if (!Array.isArray(data) || data.length === 0) {
    const error = new Error("Please upload the Excel file first");
    error.statusCode = 400;
    throw error;
  }
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getFirstNumber(row, keys) {
  for (const key of keys) {
    const value = toNumber(row[key]);
    if (value !== null) return value;
  }

  return null;
}

function normalizeFactors(data) {
  ensureUploaded(data);

  return data
    .map((row) => {
      const factor = String(row["PARENTAL LEGACY"] || row.factor || "").trim();
      const mother = getFirstNumber(row, ["Mother", "MOTHER", "__EMPTY"]);
      const father = getFirstNumber(row, ["Father", "FATHER", "__EMPTY_1"]);
      const min = getFirstNumber(row, ["Min", "MIN", "__EMPTY_3"]);
      const max = getFirstNumber(row, ["Max", "MAX", "__EMPTY_4"]);

      return {
        factor,
        mother,
        father,
        min,
        max,
      };
    })
    .filter((row) => {
      const factor = row.factor.toLowerCase();
      return (
        row.factor &&
        factor !== "total" &&
        factor !== "life factors" &&
        row.mother !== null &&
        row.father !== null
      );
    });
}

function decimal(value) {
  return Number(new Decimal(value).toDecimalPlaces(3).toString());
}

function summarizeFactors(factors) {
  if (factors.length === 0) {
    const error = new Error("No valid factor rows found in uploaded file");
    error.statusCode = 400;
    throw error;
  }

  const motherTotal = factors.reduce(
    (sum, factor) => sum.plus(factor.mother),
    new Decimal(0),
  );
  const fatherTotal = factors.reduce(
    (sum, factor) => sum.plus(factor.father),
    new Decimal(0),
  );
  const total = motherTotal.plus(fatherTotal);

  const highestMother = factors.reduce((best, factor) =>
    factor.mother > best.mother ? factor : best,
  );
  const lowestMother = factors.reduce((best, factor) =>
    factor.mother < best.mother ? factor : best,
  );
  const highestFather = factors.reduce((best, factor) =>
    factor.father > best.father ? factor : best,
  );
  const lowestFather = factors.reduce((best, factor) =>
    factor.father < best.father ? factor : best,
  );

  const comparison = factors.map((factor) => ({
    factor: factor.factor,
    mother: decimal(factor.mother),
    father: decimal(factor.father),
    higher: factor.mother === factor.father
      ? "Equal"
      : factor.mother > factor.father
        ? "Mother"
        : "Father",
    difference: decimal(new Decimal(factor.mother).minus(factor.father).abs()),
  }));

  return {
    validTotal: total.equals(100),
    motherTotal: decimal(motherTotal),
    fatherTotal: decimal(fatherTotal),
    total: decimal(total),
    highestMotherFactor: {
      factor: highestMother.factor,
      value: decimal(highestMother.mother),
    },
    lowestMotherFactor: {
      factor: lowestMother.factor,
      value: decimal(lowestMother.mother),
    },
    highestFatherFactor: {
      factor: highestFather.factor,
      value: decimal(highestFather.father),
    },
    lowestFatherFactor: {
      factor: lowestFather.factor,
      value: decimal(lowestFather.father),
    },
    factors: comparison,
  };
}

function distributeUnits(weights, totalUnits) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const raw = weights.map((weight) => (weight / totalWeight) * totalUnits);
  const floors = raw.map(Math.floor);
  let remainder = totalUnits - floors.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, fraction: value - floors[index] }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let index = 0; index < remainder; index += 1) {
    floors[order[index % order.length].index] += 1;
  }

  return floors;
}

function unitsToDecimal(units) {
  return Number((units / 1000).toFixed(3));
}

function parseBirthDay(birthDate) {
  if (!birthDate) {
    const error = new Error("birthDate is required");
    error.statusCode = 400;
    throw error;
  }

  const date = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    const error = new Error("birthDate must be a valid date string");
    error.statusCode = 400;
    throw error;
  }

  return date.getDate();
}

function generateDynamicFactors(data, birthDate) {
  const baseline = normalizeFactors(data);
  if (baseline.length === 0) {
    const error = new Error("No valid factor rows found in uploaded file");
    error.statusCode = 400;
    throw error;
  }

  const day = parseBirthDay(birthDate);
  const motherHigher = day % 2 === 1;

  const factorWeights = baseline.map((factor) => {
    const rowTotal = new Decimal(factor.mother).plus(factor.father);
    return Math.max(1, Number(rowTotal.times(1000).toFixed(0)));
  });
  const factorTotals = distributeUnits(factorWeights, TOTAL_UNITS);

  const factors = baseline.map((factor, index) => {
    const factorTotal = factorTotals[index];
    const variation = (index % 4) * 350;
    const higherUnits = Math.min(
      factorTotal - 1,
      Math.floor(factorTotal * 0.6) + variation,
    );
    const lowerUnits = factorTotal - higherUnits;

    return {
      factor: factor.factor,
      motherUnits: motherHigher ? higherUnits : lowerUnits,
      fatherUnits: motherHigher ? lowerUnits : higherUnits,
    };
  });

  const motherUnits = factors.reduce((sum, factor) => sum + factor.motherUnits, 0);
  const fatherUnits = factors.reduce((sum, factor) => sum + factor.fatherUnits, 0);

  return {
    birthDate,
    ruleApplied: motherHigher ? "Odd date: Mother values are higher" : "Even date: Father values are higher",
    factors: factors.map((factor) => ({
      factor: factor.factor,
      mother: unitsToDecimal(factor.motherUnits),
      father: unitsToDecimal(factor.fatherUnits),
      higher: factor.motherUnits > factor.fatherUnits ? "Mother" : "Father",
    })),
    motherTotal: unitsToDecimal(motherUnits),
    fatherTotal: unitsToDecimal(fatherUnits),
    total: unitsToDecimal(motherUnits + fatherUnits),
  };
}

function handleRouteError(error, res) {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
}

module.exports = {
  generateDynamicFactors,
  handleRouteError,
  normalizeFactors,
  summarizeFactors,
};
