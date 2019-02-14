import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import models from "../../models";
import { data } from "../../helpers/data";
import app from "../../index";

chai.use(chaiHttp);
const { dummyUser, dummyUser2 } = data;

describe("/User following each other", () => {
  before(async () => {
    const user1 = await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...dummyUser
      });
    const user2 = await await chai
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

  describe("/FOLLOWERS", () => {
    let token;
    before(async () => {
      const loggedInUser = await chai
        .request(app)
        .post("/api/v1/users/login")
        .send({
          email: dummyUser.email,
          password: dummyUser.password
        });
      token = loggedInUser.body.token;
    });
    it("Return number of followings", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followings`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body.user).to.be.an("object");
      expect(results.body.user).to.have.property("followings");
      expect(results.body.user.followings).to.be.an("array");
      expect(results.body.user.followings).length(0);
    });
    it("It should follow an existing author", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(201);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("Follow successful");
    });
    it("User shouldn't follow author more than once", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(409);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You are already following this author");
    });

    it("Failing on non existing user", async () => {
      const results = await chai
        .request(app)
        .post(`/api/v1/profiles/kamliWihene/follow`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(404);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("User not found");
    });
    it("Return number of followers, for author with followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(1);
    });

    it("Return number of followers", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followers`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(0);
    });
    it("Unfollow author if you are currently following him/her", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(202);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have unfollowed this author");
    });
    it("Unfollow author if you are currently following him/her", async () => {
      const results = await chai
        .request(app)
        .delete(`/api/v1/profiles/${dummyUser2.username}/follow`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(404);
      expect(results.body).to.be.an("object");
      expect(results.body.message).eql("You have already unfollowed this author");
    });
    it("Get current user's followings", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser.username}/followings`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body.user).to.be.an("object");
      expect(results.body.user).to.have.property("followings");
      expect(results.body.user.followings).to.be.an("array");
      expect(results.body.user.followings).length(0);
    });

    it("Return number of followings", async () => {
      const results = await chai
        .request(app)
        .get(`/api/v1/profiles/${dummyUser2.username}/followers`)
        .set({ Authorization: `Bearer ${token}` });
      expect(results.status).eql(200);
      expect(results.body).to.be.an("object");
      expect(results.body)
        .to.have.property("followers")
        .to.be.an("array");
      expect(results.body.followers).length(0);
    });
  });
});
