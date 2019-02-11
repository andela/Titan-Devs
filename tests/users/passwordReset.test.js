import chia, { expect, should } from "chai";
import chaiHTTP from "chai-http";
import { dammyUser } from "../../helpers/data";
import app from "../../index";
chai.use(chaiHTTP);
should();
let pwdResetToken;
describe("/API end point /users/rese_password", () => {
  describe("/POST get password reset link", async () => {
    const results = await chai
      .request(app)
      .post("/users/reset_password")
      .send({
        email: dammyUser.email
      });
    pwdResetToken = results.body.token;
    expect(results.status).eql(200);
    expect(results.body).to.be.an("object");
    expect(results.body)
      .to.have.property("message")
      .eql("Mail delivered");
    expect(results.body).to.have.property("token");
  });
  describe("/POST get password reset link", async () => {
    const results = await chai
      .request(app)
      .post("/users/reset_password")
      .send({
        email: "yves@gmail.com"
      });
    expect(results.status).eql(404);
    expect(results.body).to.be.an("object");
    expect(results.body)
      .to.have.property("message")
      .eql("User not found");
  });

  describe("/PUT update password /users/:token/password", async () => {
    const results = await chai
      .request(app)
      .put(`/users/${pwdResetToken}/password`)
      .send({
        password: "password"
      });
    expect(results.status).eql(200);
    expect(results.body.message).eql("Password updated");
  });

  describe("/PUT update password /users/:token/password", async () => {
    const results = await chai
      .request(app)
      .put(`/users/${"kldfjdkjahfdkjh"}/password`)
      .send({
        password: "password"
      });
    expect(results.status).eql(404);
    expect(results.body.message).eql("User not found");
  });
});
