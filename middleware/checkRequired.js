const { Error } = require("mongoose");

/* param validator */
module.exports = (params) => (req, res, next) => {
  const recievedParams = Object.keys(req.body);
  const missingParams = params.filter((paramsName) => {
    !recievedParams.includes(paramsName);
  });
  if (missingParams.length) {
    const error = new Error("requird param missing");
    error.statusCode = 442;
    error.errors = missingParams.reduce((agg, param) => {
      agg[param] = { type: "required" };
      return agg;
    }, {});
    return next(error);
  }
  next()
};
