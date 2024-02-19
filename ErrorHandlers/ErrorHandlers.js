exports.handle500ServerErrors = (err, req, res, next) => {
  return res.status(500).send({ msg: "Internal Server Error" });
};
