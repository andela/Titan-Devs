import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import nock from "nock";
import app from "../../index";
import { users, tokenEmailVerication, sendGridResponse } from "../helpers/testData";

import constants from "../../helpers/constants";

const { CREATED, UNAUTHORIZED, OK, NOT_FOUND, ACCEPTED, BAD_REQUEST } = constants.statusCode;

const { dummyUser3 } = users;
const { invalidToken, wrongToken, mutatedToken, noUser } = tokenEmailVerication;
chai.use(chaiHttp);
should();
let userToken;

describe("/API end point /users/confirmation/:auth_token", () => {
  before(() => {
    nock("https://api.sendgrid.com")
      .post("/v3/mail/send")
      .reply(OK, { mockResponse: sendGridResponse });
  });
  it("it is should register user with correct details", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({ ...dummyUser3 });
    expect(response.status).eql(CREATED);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.equals(
      "We have sent an email with a confirmation link to your email address. Please allow 2-5 minutes for this message to arrive"
    );
    expect(response.body.user).to.be.an("object");
    expect(Object.keys(response.body.user)).to.include.members([
      "id",
      "email",
      "username"
    ]);
    userToken = response.body.token;
  });

  it("should login user with correct details", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users/login")
      .send({
        email: "fabrice.niyomwungeri@andela.com",
        password: "password98"
      });
    expect(response.status).eql(OK);
    userToken = response.body.token;
  });

  it("should pass with valid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${userToken}`);
    expect(results.status).equal(OK);
    expect(results.body.message).equal("Email confirmed successfully!");
  });

  it("should return a user already verified", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${userToken}`);
    expect(results.status).equal(ACCEPTED);
    expect(results.body.message).equal("User already verified!");
  });

  it("should return a non-existing user", async () => {
    const results = await chai.request(app).get(`/api/v1/users/confirm/${noUser}`);
    expect(results.status).equal(NOT_FOUND);
    expect(results.body.message).equal(
      "User verification failed, User was not found"
    );
  });

  it("should fail with wrong token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${wrongToken}`);
    expect(results.status).equal(UNAUTHORIZED);
  });

  it("should fail with invalid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${invalidToken}`);
    expect(results.status).equal(UNAUTHORIZED);
    expect(results.body.message).equal("Token is invalid or expired, try again");
  });

  it("should fail with imitated token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${mutatedToken}`);
    expect(results.status).equal(UNAUTHORIZED);
    expect(results.body.message).equal("Token is invalid or expired, try again");
  });

  it("should fail with invalid email", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({ email: "hello.hello@gmail.com" });
    expect(results.body.message).to.be.equal("User not found");
    expect(results.body).to.have.property("message");
  });

  it("should fail with already verified account", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({ email: "fabrice.niyomwungeri@andela.com" });
    expect(results.body.message).to.be.equal("User verified");
    expect(results.body).to.have.property("message");
  });

  it("should fail with missing email error", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({});
    expect(results.status).equals(BAD_REQUEST);
    expect(results.body.message).to.be.equal("Email is required");
  });

  it("should return invalid email error", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({ email: "yvesiraguha" });
    expect(results.status).equals(BAD_REQUEST);
    expect(results.body.message).to.be.equal("Invalid email");
  });
});
