const { quotes,advices } = require("../data/data");

const qoutesData = quotes;
const advicesData = advices;

const allData = [...qoutesData, ...advicesData];

let start = 0;
const getGenerates = (req, res) => {
  const { query } = req;
  if (query.type == "quote") {
    start += 1;
    if (start > qoutesData.length - 1) {
      start = 0;
    }
    return res.json({
      status: "success",
      code: 201,
      data: qoutesData[start],
    });
  }
  if (query.type == "advice") {
    start += 1;
    if (start > advicesData.length - 1) {
      start = 0;
    }
    return res.json({
      status: "success",
      code: 201,
      data: advicesData[start],
    });
  }

  const randomIndex = Math.floor(Math.random() * allData.length);
  if (query.type == "random") {
    return res.json({
      status: "success",
      code: 201,
      data: allData[randomIndex],
    });
  }

  return res.json({
    status: "success",
    code: 201,
    data: null,
  });
};

module.exports = {
  getGenerates,
};
