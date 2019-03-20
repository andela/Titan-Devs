import Joi from "joi";

const validateRequest = async (req, res, next) => {
  const { id: userId, notificationId } = req.params;

  const page = parseInt(req.query.page, 10);
  const paramsSchema = Joi.object().keys({
    userId: Joi.string()
      .guid()
      .label("Invalid request"),
    notificationId: Joi.string()
      .guid()
      .label("Invalid request")
  });
  const input = {};
  input.userId = userId;
  input.notificationId = notificationId;

  const { error } = Joi.validate(input, paramsSchema);
  if (error) {
    next(error);
  } else {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(page)) {
      req.query.page = 0;
    } else {
      req.query.page = page;
    }
    next();
  }
};
export default validateRequest;
