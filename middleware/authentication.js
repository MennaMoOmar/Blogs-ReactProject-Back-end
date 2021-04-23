const User = require("../model/user");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("authorization required");
      // res.status(401).send({error: err, statusCode:401})
    }
    req.user = await User.getUserFromToken(authorization);
    if (!req.user) {
      throw new Error("authorization required");
      // res.status(401).send({error: "authorization required", statusCode:401})
    }
    next();
  } catch (err) {
    res.status(401).send({ error: "authorization required", statusCode: 401 });
    // err.statusCode = 401;
    // next(err);
  }
};
