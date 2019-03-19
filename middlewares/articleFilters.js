import constants from "../helpers/constants";

const { OK } = constants.statusCode;

export default (unfiltered, req, res, next) => {
  const { author = null, favorited = null, tag = null } = req.query;
  const articles = unfiltered
    .filter(art => author === null || art.author.username === author)
    .filter(art => tag === null || art.tagsList.includes(tag))
    .filter(art => favorited === null || art.likes.includes(favorited));
  const articlesCount = articles.length;
  return res.status(OK).json({ message: "Successful", articles, articlesCount });
};
