import chai, { should } from "chai";
import chaiHttp from "chai-http";
import models from "../../models";

import app from "../../index";

const { User } = models;
chai.use(chaiHttp);

after("Destroy the database ", done => {
  try {
    const database = User.destroy({
      where: {},
      truncate: true,
      cascade: true
    });
    if (database) {
      done();
    }
  } catch (error) {
    done(error);
  }
});
describe("Profile controller", () => {
  let token;
  before("Login", done => {
    const user = {
      email: "me@example.com",
      password: "password",
      username: "luc2018"
    };
    chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...user
      })
      .end((errors, response) => {
        if (errors) done(errors.message);
        chai
          .request(app)
          .post("/api/v1/users/login")
          .send({ email: user.email, password: user.password })
          .end((error, res) => {
            if (error) done(error.message);
            token = res.body.token;
            done();
          });
      });
  });
  it("should test updating a profile", done => {
    const user = {
      profile: {
        bio: "I am a software developer",
        image: "image-link",
        firstname: "YvesIraguha",
        lastname: "Iraguha",
        gender: "Male",
        phone: "07836378367373",
        address: "Kigali city"
      }
    };
    chai
      .request(app)
      .put("/api/v1/profiles/luc2018")
      .send(user)
      .set({ Authorization: `Bearer ${token}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have
          .property("message")
          .eql("Profile updated successfully");
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have
          .property("bio")
          .eql("I am a software developer");
        result.body.profile.should.have.property("image").eql("image-link");
        result.body.profile.should.have.property("firstname").eql("YvesIraguha");
        result.body.profile.should.have.property("lastname").eql("Iraguha");
        result.body.profile.should.have.property("gender").eql("Male");
        result.body.profile.should.have.property("phone").eql("07836378367373");
        result.body.profile.should.have.property("address").eql("Kigali city");
        done();
      });
  });
  it("should test unauthorized attempt", done => {
    const user = {
      profile: {
        bio: "I am a software developer",
        image: "image-link",
        following: "false"
      }
    };
    chai
      .request(app)
      .put("/api/v1/profiles/Yves2013")
      .send(user)
      .set({ Authorization: `Bearer ${token}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(403);
        result.body.should.have.property("error").eql("Not authorized");
        done();
      });
  });
  it("should test fetching a profile of a user", done => {
    const username = "luc2018";
    chai
      .request(app)
      .get(`/api/v1/profiles/${username}`)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have.property("username").eql("luc2018");
        result.body.profile.should.have
          .property("bio")
          .eql("I am a software developer");
        result.body.profile.should.have.property("image").eql("image-link");
        done();
      });
  });
  it("should test fetching a profile an non-existing user", done => {
    const username = "Yves2018";
    chai
      .request(app)
      .get(`/api/v1/profiles/${username}`)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(400);
        result.body.should.have
          .property("message")
          .which.is.eql("No user with that name");
        done();
      });
  });
  it("should test fetching all profiles", done => {
    chai
      .request(app)
      .get("/api/v1/profiles")
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have.property("profiles").which.is.a("array");
        done();
      });
  });
  it("should test deleting a user", done => {
    const username = "luc2018";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have
          .property("message")
          .eql("Profile deleted successfully");
        done(error);
      });
  });
  it("should test deleting an non-existing user", done => {
    const username = "luc2018";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(401);
        done();
      });
  });
  it("should test deleting an unauthorized request", done => {
    const username = "Yves2018";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(401);
        done();
      });
  });
});
