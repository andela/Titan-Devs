import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";

chai.use(chaiHttp);
const should = chai.should();

/**
 * @author Yves
 */

describe("POSt /api/v1/users/login", () => {
  /** create a user in database with below credentials
   * @const user = { email:'test@test.com, password:'password'}
   */
  // create a script that delete the user after test suites.
  it("It should return a token", done => {
    const user = {
      email: "test@test.com",
      password: "password"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("User logged in successfully");
        res.body.should.have.property("token").which.is.a("string");
        done();
      });
  });

  it("It should return a missing email error ", done => {
    const user = {
      password: "password"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.body.should.have.property("message").eql("Please provide an email");
        res.statusCode.should.be(400);
        done();
      });
  });
  it("It should return a missing password error", done => {
    const user = {
      email: "test@test.com"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error);
        res.statusCode.should.be(400);
        res.body.should.have.property("message").eql("Please provide a password");
        done();
      });
  });
  it("It should return an empty email error", done => {
    const user = {
      email: " ",
      password: "password"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.statusCode.should.be(400);
        res.body.should.have.property("message").eql("Email cannot be empty");
        done();
      });
  });
  it("It should return an empty password error", done => {
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
        res.statusCode.should.be(400);
        res.body.should.have.property("message").eql("Password cannot be empty");
        done();
      });
  });
  it("It should return a wrong password error", done => {
    const user = {
      email: "test@test.com",
      password: "passwor"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.statusCode.should.be(400);
        res.body.should.have.property("message").eql("Wrong password, try again!");
        done();
      });
  });
  it("It should return a non-existing user error", done => {
    const user = {
      user: "user@user.com",
      password: "user@user"
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, res) => {
        if (error) done(error.message);
        res.statusCode.should.be(400);
        res.body.should.have
          .property("message")
          .eql("The user with those credentials does not exist");
        done();
      });
  });
});
