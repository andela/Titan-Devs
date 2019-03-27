import models from "../../../models";

const { User } = models;
/**
 * @description create a user from social authentication profile
 * @param  {object} profile - user data from social website (eg : twitter, google , or facebook)
 * @return {User} - a user from the database
 */
const createUserFromSocial = async profile => {
  const options = {
    where: { $or: [{ socialId: profile.id }] },
    raw: true,
    defaults: {
      firstName: profile.displayName,
      isVerified: true,
      socialId: profile.id,
      username: profile.username
    }
  };
  if (profile.provider === "twitter") {
    options.where.$or.push({ username: profile.username });
    options.defaults.email = `${profile.username}@ah.com`;
  } else {
    options.where.$or.push({ email: profile.emails[0].value });
    options.defaults.email = profile.emails[0].value;
  }
  try {
    const user = await User.findOrCreate(options);
    return user[0] ? user[0] : false;
  } catch (error) {
    return false;
  }
};

export default createUserFromSocial;
