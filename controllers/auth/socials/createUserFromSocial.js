import models from "../../../models";

const { User } = models;
/**
 * @description create a user from social authentication profile
 * @param  {object} profile - user data from social website (eg : twitter, google , or facebook)
 * @return {User} - a user from the database
 */
const createUserFromSocial = async profile => {
  let email;
  if (profile.emails) {
    email = profile.emails[0].value;
  } else {
    email = `${profile.id}@ah.com`;
  }
  const username =
    profile.username || `${profile.name.familyName}_${profile.name.givenName}`;
  try {
    const user = await User.findOrCreate({
      where: {
        $or: [{ socialId: profile.id }, { email }]
      },
      defaults: {
        username: `${username} + ${Date.now()}`,
        firstname: profile.displayName,
        email,
        isVerified: true,
        socialId: profile.id
      },
      raw: true
    });
    return user[0] ? user[0] : false;
  } catch (error) {
    return false;
  }
};

export default createUserFromSocial;
