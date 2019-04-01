import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import { users } from "../helpers/testData";
import constants from "../../helpers/constants";
import { newRole } from "../setups.test";

const { NOT_FOUND, BAD_REQUEST } = constants.statusCode;
chai.use(chaiHttp);
const { dummyUser3 } = users;

describe("POST /api/v1/users/login", () => {
  before("Create a user in database", done => {
    chai
      .request(app)
      .post("/api/v1/users")
      .send({ ...dummyUser3, roleId: newRole.id })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it("should return a token", done => {
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send({
        email: dummyUser3.email,
        password: dummyUser3.password
      })
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("Logged in successfully");
        res.body.should.have.property("token").which.is.a("string");
        done();
      });
  });

  it("should return a missing email error ", done => {
    const user = {
      password: dummyUser3.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("Please provide an email");
        res.status.should.be.equal(BAD_REQUEST);
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
        res.status.should.be.equal(BAD_REQUEST);
        res.body.should.have.property("message").eql("Please provide a password");
        done();
      });
  });

  it("should return an empty email error", done => {
    const user = {
      email: " ",
      password: dummyUser3.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(BAD_REQUEST);
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
        res.status.should.be.equal(BAD_REQUEST);
        res.body.should.have.property("message").eql("Password cannot be empty");
        done();
      });
  });

  it("should test a wrong password error", done => {
    const user = {
      email: dummyUser3.email,
      password: "passwor"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(BAD_REQUEST);
        res.body.should.have.property("message").eql("Invalid email or password!");
        done();
      });
  });

  it("should test a non-existing user error ", done => {
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
        res.status.should.be.equal(NOT_FOUND);
        res.body.should.have.property("message").eql("Invalid email or password!");
        done();
      });
  });

  it("should test an email of wrong format", done => {
    const user = {
      email: "123.com",
      password: dummyUser3.password
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.status.should.be.equal(BAD_REQUEST);
        res.body.should.have.property("message").eql("Invalid email format!");
        done();
      });
  });
});
