import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import models from "../../models";
import { data } from "../../helpers/data";
const { dammyUser2 } = data;

chai.use(chaiHttp);
should();
let pwdResetToken;
describe("/API end point /users/rese_password", () => {
  before(async () => {
    await models.User.create({
      ...dammyUser2
    });
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
        email: dammyUser2.email
      });
    pwdResetToken = results.body.token;
    expect(results.status).equal(200);
    expect(results.body).to.be.an("object");
    expect(results.body)
      .to.have.property("message")
      .eql("Password rest link sent");
    expect(results.body).to.have.property("token");
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

  it("/PUT update password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/${pwdResetToken}/password`)
      .send({
        password: "password"
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
    expect(results.body.message).eql("Invalid or experied token provided");
  });
});
