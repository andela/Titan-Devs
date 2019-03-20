import constants from "../helpers/constants";

const { OK } = constants.statusCode;

/**
 * @description After articles are fetched,
 * this gets them from the previous handler and filter them by any of the
 *  following search queries passed by the user[favorited,author,tag].
 * @param  {object} req - The request object
 * @param  {object} res - The response object
 * @returns {object} It returns the request's response object
 */
/* eslint-disable-next-line no-unused-vars */
export default (unfiltered, req, res, next) => {
  const { author = null, favorited = null, tag = null } = req.query;
  const articles = unfiltered
    .filter(art => author === null || art.author.username === author)
    .filter(art => tag === null || art.tagsList.includes(tag))
    .filter(art => favorited === null || art.likes.includes(favorited));
  const articlesCount = articles.length;
  return res.status(OK).json({ message: "Successful", articles, articlesCount });
};
