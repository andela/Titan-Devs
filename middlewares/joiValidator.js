import constants from "../helpers/constants";

const { BAD_REQUEST } = constants.statusCode;
const joiErrors = () => (err, req, res, next) => {
  if (!err.isJoi) return next(err);
  return res.status(BAD_REQUEST).json({
    message: err.details[0].context.label
  });
};

export default joiErrors;
