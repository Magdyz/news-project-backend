exports.handleCustomErrors = (error, req, res, next) => {
  if (error.code === "22P02" || error.code === "23503") {
    return res.status(400).send({ msg: "Bad Request" });
  }
  next(error);
};

exports.handle500ServerErrors = (error, req, res, next) => {
  return res.status(500).send({ msg: "Internal Server Error" });
};

exports.handle404Errors = (error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  }
  next();
};
