/**
 * Calculate the read time
 *
 * @param  {object} req -request to the route
 * @returns {integer} - It returns the time period in minutes
 */

export default article => {
  let body = article.body.body;
  if (!body) {
    return 0;
  }
  let readTime = Math.ceil(body.split(" ").length / 265);
  return readTime;
};
