import joi from "joi";
import constants from "../helpers/constants";
import {
  highlightValidator,
  editHighlightValidator,
  oneHighlightValidator
} from "../helpers/highlightValidator";

const { BAD_REQUEST } = constants.statusCode;
/**
 * @description validate request parameters for create a highlight endpoint
 * @param  {Object} req - The request object.
 * @param  {Object} res - The response object.
 * @param  {Object} next - The next middleware.
 */

const validateHighlight = (req, res, next) => {
  const { start, end } = req.query;
  joi.validate({ start, end }, highlightValidator, (err, _value) =>
    err ? next(err) : next()
  );
};

const validateEditHighlight = (req, res, next) => {
  const { highlightId } = req.params;
  const { start, end } = req.query;

  joi.validate({ start, end, highlightId }, editHighlightValidator, (err, _value) =>
    err ? next(err) : next()
  );
};

const validateOneHighlight = (req, res, next) => {
  const { highlightId } = req.params;

  joi.validate({ highlightId }, oneHighlightValidator, (err, _value) =>
    err ? next(err) : next()
  );
};
/**
 * @description select the highlightedText from article body
 * @param  {Object} req - The request object.
 * @param  {Object} res - The response object.
 * @param  {Object} next - The next middleware.
 */

const selectHighlightedText = (req, res, next) => {
  const { start, end } = req.query;
  const { article } = req;
  if (end > article.body.length) {
    res.status(BAD_REQUEST).json({
      message: "Please provide a valid end index"
    });
  } else {
    const highlightedText = article.body.slice(start, end);
    req.highlightedText = highlightedText;
    next();
  }
};
export {
  validateOneHighlight,
  validateEditHighlight,
  validateHighlight,
  selectHighlightedText
};
