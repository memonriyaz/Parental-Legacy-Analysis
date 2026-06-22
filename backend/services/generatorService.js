function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(3);
}

function generateFactors(data, day) {
  let factors = [];

  let motherTotal = 0;
  let fatherTotal = 0;

  const motherHigher = day % 2 === 1;
  const rows = data.slice(1, -1);

  rows.forEach((item) => {
    const factor = item["PARENTAL LEGACY"];

    const min = item.__EMPTY_3;
    const max = item.__EMPTY_4;

    let mother;
    let father;

    if (motherHigher) {
      mother = randomBetween((min + max) / 2, max);
      father = randomBetween(min, (min + max) / 2);
    } else {
      father = randomBetween((min + max) / 2, max);
      mother = randomBetween(min, (min + max) / 2);
    }

    motherTotal += mother;
    fatherTotal += father;

    factors.push({
      factor,
      mother,
      father,
    });
  });

  const initialTotal = motherTotal + fatherTotal;
  const scale = 100 / initialTotal;

  motherTotal = 0;
  fatherTotal = 0;

  factors.forEach((f) => {
    f.mother = +(f.mother * scale).toFixed(3);
    f.father = +(f.father * scale).toFixed(3);

    motherTotal += f.mother;
    fatherTotal += f.father;
  });

  motherTotal = +motherTotal.toFixed(3);
  fatherTotal = +fatherTotal.toFixed(3);

  let total = +(motherTotal + fatherTotal).toFixed(3);

  let diff = +(100 - total).toFixed(3);
  factors[factors.length - 1].father = +(
    factors[factors.length - 1].father + diff
  ).toFixed(3);

  fatherTotal = +(fatherTotal + diff).toFixed(3);
  total = +(motherTotal + fatherTotal).toFixed(3);

  return {
    factors,
    motherTotal: +motherTotal.toFixed(3),
    fatherTotal: +fatherTotal.toFixed(3),
    total: +(motherTotal + fatherTotal).toFixed(3),
  };
}

module.exports = generateFactors;
