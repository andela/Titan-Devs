import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import models from "../../models";
import { data } from "../../helpers/data";

const { dummyUser3 } = data;
chai.use(chaiHttp);
should();
let userToken;
const invalidToken =
  "eyJhbGciOiJIUzJpZCI6ImI5ZjZjN2JiLWM1NTItNDUyNS04MTUwLWI0NTI5NjNkMTZiZiIsImlhdCI6MTU1MDAwODA4Mn0.xCpwywFSzqHXbikot0SzS8fUpPKsqMVMtgmpf4OD_l8";
const wrongToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0MzM0YTA4LTMyMWEtNDdhYS1iMGVmLTQ5ODZmMWYyN2Q0OSIsImlhdCI6MTU1MDA1MzIzN30.O2QZO576DJ-iLc1ge7yU-jHdoAlQq9CK9Kc6QGqRuic";

describe("/API end point /users/confirmation/:auth_token ", () => {
  before(async () => {
    await models.User.destroy({
      where: { email: "fabrice.niyomwungeri@andela.com" },
      truncate: true
    });
  });
  it("it is should register user with corret details", async () => {
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
  it("/GET it should pass with valid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${userToken}`);
    expect(results.status).equal(200);
  });
  it("/PUT it should fail with wrong token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${wrongToken}`);
    expect(results.status).equal(404);
  });
  it("/PUT it should fail with invalid token", async () => {
    const results = await chai
      .request(app)
      .get(`/api/v1/users/confirm/${invalidToken}`);
    expect(results.status).equal(500);
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
    expect(results.body.message).to.be.equal("Email sent successufully");
    expect(results.body).to.have.property("message");
  });
});
