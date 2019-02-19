/**
 * Calculate the read time
 *
 * @param  {object} req -request to the route
 * @returns {integer} - It returns the time period in minutes
 */

export default article => {
  const body = article.body.body;
  if (!body) {
    return 0;
  }
  const readTime = Math.ceil(body.split(" ").length / 265);
  return readTime;
};
