import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import nock from "nock";
import app from "../../index";
import models from "../../models";
import { users, sendGridResponse } from "../helpers/testData";

const { dummyUser } = users;
chai.use(chaiHttp);
should();
let pwdResetToken;

describe("Password controller", () => {
  before(async () => {
    await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...dummyUser
      });
    nock("https://api.sendgrid.com")
      .post("/v3/mail/send")
      .reply(200, { mockResponse: sendGridResponse });
  });
  after(async () => {
    await models.User.destroy({
      where: {},
      truncate: true,
      cascade: true
    });
  });
  it("should send password rest link", async () => {
    const results = await chai
      .request(app)
      .post("/api/v1/users/reset_password")
      .send({
        email: dummyUser.email
      });
    pwdResetToken = results.body.user.resetToken;
    expect(results.status).equal(200);
    expect(results.body).to.be.an("object");
    expect(results.body)
      .to.have.property("message")
      .eql("Mail delivered");
    expect(results.body.user).to.be.an("object");
    expect(results.body.user).to.have.property("resetToken");
  });
  it("should not send the link to non existing user", async () => {
    const results = await chai
      .request(app)
      .post("/api/v1/users/reset_password")
      .send({
        email: "yves@gmail.com"
      });
    expect(results.status).equal(404);
    expect(results.body).to.be.an("object");
    expect(results.body)
      .to.have.property("message")
      .eql("User not found");
  });
  it("should fail on non alphanumeric password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: "you@8*"
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql(
      "The password should be an alphanumeric with at least 8 characters"
    );
  });
  it("should return error if new password is the same as current one", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: dummyUser.password
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql(
      "Your new password was the same as your current one"
    );
  });
  it("should update password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: "password78t67"
      });
    expect(results.status).equal(200);
    expect(results.body.message).eql("Password updated");
  });
  it("should return an error on invalid token", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${"kldfjdkjahfdkjh"}/password`)
      .send({
        password: "password"
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql("Invalid or expired link");
  });
  it("should return an error on expired token", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: "245452hello"
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql("Link expired");
  });
});
