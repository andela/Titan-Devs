import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import nock from "nock";
import app from "../../index";
import { tokenEmailVerication, sendGridResponse } from "../helpers/testData";
import { token, user } from "../setups.test";
import constants from "../../helpers/constants";

const { UNAUTHORIZED, OK, NOT_FOUND, ACCEPTED, BAD_REQUEST } = constants.statusCode;

const { invalidToken, wrongToken, mutatedToken, noUser } = tokenEmailVerication;
chai.use(chaiHttp);
should();

describe("/API end point /users/confirmation/:auth_token", () => {
  before(() => {
    nock("https://api.sendgrid.com")
      .post("/v3/mail/send")
      .reply(OK, { mockResponse: sendGridResponse });
  });

  it("should pass with valid token", async () => {
    const results = await chai.request(app).get(`/api/v1/users/confirm/${token}`);
    expect(results.status).equal(OK);
    expect(results.body.message).equal("Email confirmed successfully!");
  });

  it("should return a user already verified", async () => {
    const results = await chai.request(app).get(`/api/v1/users/confirm/${token}`);
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
      .send({ email: user.email });
    expect(results.body.message).to.be.equal(
      "We have re-sent an email with a confirmation link to your email address. Please allow 2-5 minutes for this message to arrive"
    );
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
