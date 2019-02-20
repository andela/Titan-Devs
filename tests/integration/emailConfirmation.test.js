import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import models from "../../models";
import { users, tokenEmailVerication } from "../helpers/testData";

const { dummyUser3 } = users;
const { invalidToken, wrongToken } = tokenEmailVerication;
chai.use(chaiHttp);
should();
let userToken;

describe("/API end point /users/confirmation/:auth_token", () => {
  before(async () => {
    await models.User.destroy({
      where: { email: "fabrice.niyomwungeri@andela.com" },
      truncate: true,
      cascade: true
    });
  });
  it("it is should register user with corret details ", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({ ...dummyUser3 });
    expect(response.status).eql(201);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.equals("User registered successfully");
    expect(response.body.user).to.be.an("object");
    expect(Object.keys(response.body.user)).to.include.members([
      "id",
      "email",
      "username"
    ]);
    userToken = response.body.token;
  });
  it("it is should login user with corret details", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users/login")
      .send({
        email: "fabrice.niyomwungeri@andela.com",
        password: "password98"
      });
    expect(response.status).eql(200);
    userToken = response.body.token;
  });
  it("/GET it should pass with valid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${userToken}`);
    expect(results.status).equal(200);
    expect(results.body.message).equal("Email confirmed successfully!");
  });
  it("/PUT it should fail with wrong token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${wrongToken}`);
    console.log(results);
    expect(results.status).equal(401);
  });
  it("/PUT it should fail with invalid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${invalidToken}`);
    expect(results.status).equal(401);
  });
  it("/PUT it should fail with invalid email", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({ email: "hello.hello@gmail.com" });
    expect(results.body.message).to.be.equal("User not found");
    expect(results.body).to.have.property("message");
  });
  it("/PUT it should fail with already verified account", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/resend`)
      .send({ email: "fabrice.niyomwungeri@andela.com" });
    expect(results.body.message).to.be.equal("User verified");
    expect(results.body).to.have.property("message");
  });
});
