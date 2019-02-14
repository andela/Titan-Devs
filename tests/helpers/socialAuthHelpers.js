import nock from "nock";

const dummyUser = {
  id: "113497765187161548343",
  displayName: "Espoir Murhabazi",
  name: { familyName: "Murhabazi", givenName: "Espoir" },
  emails: [{ value: "test@test.com", type: "account" }],
  photos: [
    {
      value:
        "https://lh3.googleusercontent.com/a-/AAuE7mDMB8spoGWTcZyxqzDhTSANKT1Q_vW54EcIpAtn?sz=50"
    }
  ],
  gender: "male",
  provider: "google",
  username: "espoir_murhabazi"
};

/**
 * @description mock social authentication endpoint with user data
 * @param  {Object} url - The endpoint to mock
 * @returns{None} None
 */
const mockSocialAuth = url => {
  if (url.indexOf("twitter") !== -1) {
    nock(url)
      .filteringPath(() => "/")
      .persist()
      .post("/")
      .reply(302, undefined, {
        Location: `/api/v1/profile/${dummyUser.username}`
      });
  } else {
    nock(url)
      .filteringPath(() => "/")
      .persist()
      .get("/")
      .reply(302, undefined, {
        Location: `/api/v1/profile/${dummyUser.username}`
      });
  }
};

/**
 * @description mock social authentication endpoint without user data
 * @param  {Object} url - The endpoint to mock
 * @returns{None} None
 */
const mockSocialAuthNonUser = url => {
  if (url.indexOf("twitter") !== -1) {
    nock.cleanAll();
    nock(url)
      .filteringPath(() => "/")
      .persist()
      .post("/")
      .reply(400, {
        msg: "Bad Request",
        status: "failed"
      });
  } else {
    nock.cleanAll();
    nock(url)
      .filteringPath(() => "/")
      .get("/")
      .reply(400, {
        msg: "Bad Request",
        status: "failed"
      });
  }
};
export { dummyUser, mockSocialAuth, mockSocialAuthNonUser };
