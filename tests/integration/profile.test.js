import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import { users } from "../helpers/testData";
import constants from "../../helpers/constants";
import { token3, user3 } from "../setups.test";

const { OK, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } = constants.statusCode;
chai.use(chaiHttp);

describe("Profile controller", () => {
  it("should test updating a profile", done => {
    chai
      .request(app)
      .put(`/api/v1/profiles/${user3.username}`)
      .send(users.dummyUser5)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(OK);
        result.body.should.have
          .property("message")
          .eql("Profile updated successfully");
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have
          .property("bio")
          .eql("I am a software developer");
        result.body.profile.should.have.property("image").eql("image-link");
        result.body.profile.should.have.property("firstName").eql("YvesIraguha");
        result.body.profile.should.have.property("lastName").eql("Iraguha");
        result.body.profile.should.have.property("gender").eql("Male");
        result.body.profile.should.have.property("phone").eql("07836378367373");
        result.body.profile.should.have.property("address").eql("Kigali city");
        done();
      });
  });

  it("should test updating a profile with invalid first name and last name", done => {
    const user = users.dummyUser6;
    chai
      .request(app)
      .put(`/api/v1/profiles/${user3.username}`)
      .send(user)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(BAD_REQUEST);
        result.body.should.have.property("error").which.is.a("string");
        done();
      });
  });

  it("should test unauthorized update attempt", done => {
    const user = users.dummyUser7;
    chai
      .request(app)
      .put("/api/v1/profiles/Yves2013")
      .send(user)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(FORBIDDEN);
        result.body.should.have.property("error").eql("Not authorized");
        done();
      });
  });

  it("should test unauthorized delete attempt", done => {
    chai
      .request(app)
      .delete("/api/v1/profiles/Yves2013")
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(FORBIDDEN);
        result.body.should.have.property("message").eql("Unauthorized request");
        done();
      });
  });

  it("should test fetching a profile of a user", done => {
    chai
      .request(app)
      .get(`/api/v1/profiles/${user3.username}`)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(OK);
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have.property("username").eql("luc2018");
        result.body.profile.should.have
          .property("bio")
          .eql("I am a software developer");
        result.body.profile.should.have.property("image").eql("image-link");
        done();
      });
  });

  it("should test fetching a profile an non-existing user3", done => {
    const username = "Yves2018";
    chai
      .request(app)
      .get(`/api/v1/profiles/${username}`)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(BAD_REQUEST);
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
        result.status.should.be.eql(OK);
        result.body.should.have.property("profiles").which.is.a("array");
        done();
      });
  });

  it("should test deleting a user", done => {
    chai
      .request(app)
      .delete(`/api/v1/profiles/${user3.username}`)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(OK);
        result.body.should.have
          .property("message")
          .eql("Profile deleted successfully");
        done(error);
      });
  });

  it("should test deleting an non-existing user3", done => {
    const username = "luc2018";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(UNAUTHORIZED);
        done();
      });
  });

  it("should test deleting an unauthorized request", done => {
    const username = "Yves2018";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .set({ Authorization: `Bearer ${token3}` })
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(UNAUTHORIZED);
        done();
      });
  });
});
