import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { users } from "../helpers/testData";
import app from "../../index";
import constants from "../../helpers/constants";

const { CREATED, OK, NOT_FOUND, ACCEPTED, CONFLICT } = constants.statusCode;
chai.use(chaiHttp);
const { dummyUser, dummyUser2 } = users;

describe("User following", () => {
  before(async () => {
    await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...dummyUser
      });
    await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...dummyUser2
      });
  });

  describe("Followers controller", () => {
    let userToken;
    before(async () => {
      const loggedInUser = await chai
        .request(app)
        .post("/api/v1/users/login")
        .send({
          email: dummyUser.email,
          password: dummyUser.password
        });
      const { token } = loggedInUser.body;
      userToken = token;
    });

    it("Return number of people a user is following", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(OK);
      expect(results.body).to.be.an("object");
      expect(results.body.user).to.be.an("object");
      expect(results.body.user).to.have.property("followings");
      expect(results.body.user.followings).to.be.an("array");
      expect(results.body.user.followings).length(0);
    });

    it("It should allow a user to follow an existing author", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(CREATED);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("Follow successful");
    });

    it("shouldn't allow a user to follow an author more than once", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(CONFLICT);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You are already following this author");
    });

    it("should only allow following of existing user", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/kamliWihene/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(NOT_FOUND);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("User not found");
    });

    it("should return number of followers when there are existing followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(OK);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(1);
    });

    it("should return a non-existing user error", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/iraguha2020/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(NOT_FOUND);
      expect(results.body.message).eql("User not found");
    });

    it("should return an empty array when user has no followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(OK);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(0);
    });

    it("should allow a user to unfollow an author", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(ACCEPTED);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have unfollowed this author");
    });

    it("should throw a non-existing user error", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/iraguha2019/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(NOT_FOUND);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("User not found");
    });

    it("should return an error message when unfollowing an author you were not following", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(NOT_FOUND);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have already unfollowed this author");
    });

    it("should get a current user's followings", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(OK);
      expect(results.body).to.be.an("object");
      expect(results.body.user).to.be.an("object");
      expect(results.body.user).to.have.property("followings");
      expect(results.body.user.followings).to.be.an("array");
      expect(results.body.user.followings).length(0);
    });

    it("should return an non-existing user error", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/iraguha2030/followings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(NOT_FOUND);
      expect(results.body.message).eql("User not found");
    });

    it("should return a user's number of followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(OK);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(0);
    });
  });
});
