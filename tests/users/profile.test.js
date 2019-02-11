import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";

chai.use(chaiHttp);

describe("Test profile creation", () => {
  it("It should test creating a profile of a user", done => {
    const user = {
      profile: {
        username: "jake",
        bio: "I work at statefarm",
        image: "image-link",
        following: false
      }
    };
    chai
      .request(app)
      .post("/profiles")
      .send(user)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(201);
        result.body.should.have.property("profile").which.is.a("object");

        result.body.profile.should.have.property("image").eql("image-link");
        result.body.profile.should.have.property("bio").eql("I work at statefarm");
        result.body.profile.should.have.property("username").eql("jake");
        done();
      });
  });
  it("It should test updating a profile", done => {
    const user = {
      profile: {
        username: "jake",
        bio: "I am unemployed",
        image: "image-link",
        following: false
      }
    };
    chai
      .request(app)
      .put("/profile/jake")
      .send(user)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have.property("username").eql("jake");
        result.body.should.have
          .property("message")
          .eql("Profile updated successfully");
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have.property("bio").eql("I am unemployed");
        result.body.profile.should.have.property("image").eql("image-link");
        done();
      });
  });
  it("It should test fetching a profile of a user", done => {
    const username = "jake";
    chai
      .request(app)
      .get("/api/v1/profiles/jake")
      .end((error, result) => {
        if (error) done(error);

        result.status.should.be.eql(200);
        result.body.should.have.property("profile").which.is.a("object");
        result.body.profile.should.have.property("username").eql("jake");
        result.body.profile.should.have.property("bio").eql("I work at statefarm");
        result.body.profile.should.have.property("image").eql("image-link");
        done();
      });
  });

  it("It should test fetching all profiles", done => {
    chai
      .request(app)
      .get("/api/v1/profiles/jake")
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have.property("profiles").which.is.a("array");
        done();
      });
  });
  it("It should test deleting a user", done => {
    const username = "jake";
    chai
      .request(app)
      .delete(`/api/v1/profiles/${username}`)
      .end((error, result) => {
        if (error) done(error);
        result.status.should.be.eql(200);
        result.body.should.have
          .property("message")
          .eql("Profile deleted successfully");
        done(error);
      });
  });
});
