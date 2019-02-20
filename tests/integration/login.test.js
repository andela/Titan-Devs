import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import models from "../../models";
import { users } from "../helpers/testData";

chai.use(chaiHttp);
const { dummyUser } = users;

describe("POST /api/v1/users/login", () => {
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

  before("Create a user in database", done => {
    chai
      .request(app)
      .post("/api/v1/users")
      .send({ ...dummyUser })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it("should return a token", done => {
    const user = {
      email: dummyUser.email,
      password: dummyUser.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("Logged in successfully");
        res.body.should.have.property("token").which.is.a("string");
        done();
      });
  });

  it("should return a missing email error ", done => {
    const user = {
      password: dummyUser.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("Please provide an email");
        res.status.should.be.equal(400);
        done();
      });
  });

  it("should return a missing password error", done => {
    const user = {
      email: "test@test.com"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error);
        res.status.should.be.equal(400);
        res.body.should.have.property("message").eql("Please provide a password");
        done();
      });
  });

  it("should return an empty email error", done => {
    const user = {
      email: " ",
      password: dummyUser.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(400);
        res.body.should.have.property("message").eql("Email cannot be empty");
        done();
      });
  });

  it("should return an empty password error", done => {
    const user = {
      email: "test@test.com",
      password: " "
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(400);
        res.body.should.have.property("message").eql("Password cannot be empty");
        done();
      });
  });

  it("should test a wrong password error", done => {
    const user = {
      email: dummyUser.email,
      password: "passwor"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(400);
        res.body.should.have.property("message").eql("Invalid email or password!");
        done();
      });
  });

  it("should test a non-existing user error", done => {
    const user = {
      email: "test@test.com",
      password: "user@user"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(404);
        res.body.should.have.property("message").eql("Invalid email or password!");
        done();
      });
  });

  it("should test an email of wrong format", done => {
    const user = {
      email: "123.com",
      password: dummyUser.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(400);
        res.body.should.have.property("message").eql("Invalid email format!");
        done();
      });
  });
});
