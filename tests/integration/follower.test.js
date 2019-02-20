import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import models from "../../models";
import { users } from "../helpers/testData";
import app from "../../index";

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

  after(async () => {
    await models.Follower.destroy({
      where: {},
      truncate: true,
      cascade: true
    });
    await models.User.destroy({
      where: {},
      truncate: true,
      cascade: true
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
      expect(results.status).eql(200);
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
      expect(results.status).eql(201);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("Follow successful");
    });

    it("shouldn't allow a user to follow an author more than once", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(409);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You are already following this author");
    });

    it("should only allow following of existing user", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/kamliWihene/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(404);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("User not found");
    });

    it("should return number of followers when there are existing followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(1);
    });

    it("should return an empty array when user has no followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(200);
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
      expect(results.status).eql(202);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have unfollowed this author");
    });

    it("should return an error message when unfollowing an author you were not following", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(404);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have already unfollowed this author");
    });

    it("should get a current user's followings", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followings`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body.user).to.be.an("object");
      expect(results.body.user).to.have.property("followings");
      expect(results.body.user.followings).to.be.an("array");
      expect(results.body.user.followings).length(0);
    });

    it("should return a user's number of followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${userToken}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(0);
    });
  });
});
