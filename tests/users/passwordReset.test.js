import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import models from "../../models";
import { data } from "../../helpers/data";
const { dummyUser2 } = data;

chai.use(chaiHttp);
should();
let pwdResetToken;
describe("/API end point /users/rese_password", () => {
  before(async () => {
    await chai.request(app).post('/api/v1/users').send({
      ...dummyUser2
    })
  });
  after(async () => {
    await models.User.destroy({
      where: {},
      truncate: true
    });
  });
  it("/POST get password reset link", async () => {
    const results = await chai
      .request(app)
      .post("/api/v1/users/reset_password")
      .send({
        email: dummyUser2.email
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
  it("/POST user not found on non existing user", async () => {
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

  it("/PUT faild for short non alphanumeric password", async () => {
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

  it("/PUT if password is the same as current one", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: dummyUser2.password
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql(
      "Your new password was the same as your current one"
    );
  });

  it("/PUT update password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: "password78t67"
      });
    expect(results.status).equal(200);
    expect(results.body.message).eql("Password updated");
  });

  it("/PUT invalid token", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${"kldfjdkjahfdkjh"}/password`)
      .send({
        password: "password"
      });
    expect(results.status).equal(400);
    expect(results.body.message).eql("Invalid or expired link");
  });

  it("/PUT update password", async () => {
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
