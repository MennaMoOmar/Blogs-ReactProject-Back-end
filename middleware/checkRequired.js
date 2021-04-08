/* param validator */
module.exports = (params) => (req, res, next) => {
  const recievedParams = Object.keys(req.body);
  const missingParams = params.filter((paramsName) => !recievedParams.includes(paramsName));
  if (missingParams.length) {
    const error = new Error("requird param missing");
    error.statusCode = 406;
    error.errors = missingParams.reduce((agg, param) => {
      agg[param] = { type: "required" };
      return agg;
    }, {});
    return res.status(406).send({error: error})
    // return next(error);
  }
  next()
};
