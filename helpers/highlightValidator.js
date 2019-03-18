import joi from "joi";

const highlightValidator = joi.object().keys({
  start: joi
    .number()
    .min(0)
    .required()
    .label("Please provide a valid start index"),
  end: joi
    .number()
    .min(0)
    .greater(joi.ref("start"))
    .required()
    .label("Please provide a valid end index")
});

const editHighlightValidator = joi.object().keys({
  start: joi
    .number()
    .min(0)
    .required()
    .label("Please provide a valid start index"),
  end: joi
    .number()
    .min(0)
    .greater(joi.ref("start"))
    .required()
    .label("Please provide a valid end index"),
  highlightId: joi
    .string()
    .uuid()
    .required()
    .label("Please provide a valid highlight id")
});

const oneHighlightValidator = joi.object().keys({
  highlightId: joi
    .string()
    .uuid()
    .required()
    .label("Please provide a valid highlight id")
});

export { highlightValidator, editHighlightValidator, oneHighlightValidator };
