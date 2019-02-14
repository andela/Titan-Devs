const joiErrors = () => (err, req, res, next) => {
  if (!err.isJoi) return next(err);
  return res.status(400).json({
    message: err.details[0].context.label
  });
};

export default joiErrors;
