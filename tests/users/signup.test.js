import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";

const userDamie = {
  email: "luc.bayo@gmail.com",
  password: "password",
  username: "luc2017"
};
chai.use(chaiHttp);
should();

describe("API end point for auth/signup ", () => {
  it("it is should register user with corret details", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({ ...userDamie });
    expect(response.status).eql(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.equals("User registered successfully");
    expect(response.body.user).to.be.an("object");
    expect(Object.keys(response.body.user)).to.include.members([
      "id",
      "email",
      "username"
    ]);
  });

  it("it should fail if one of email, firstName, lastName, or password is empty", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({ email: "", password: "", username: "" });
    expect(response.status).eql(400);
    expect(response.body.message).eql("User registration failed");
    expect(response.body.errors).to.deep.equal({
      username: "Username is required",
      email: "Email is required",
      password: "Password is required"
    });
  });

  it("it should fail if user provide invalid email", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...userDamie,
        email: "luc@@gmail.com.com"
      });
    expect(response.status).eql(400);
    expect(response.body.message).to.be.equal("Invalid email");
  });

  it("It should fail if email already exist", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        email: "luc.bayo@gmail.com",
        password: "12345",
        username: "jean786"
      });
    expect(response.status).equal(400);
    expect(response.body).to.be.an("object");
    expect(response.body.message).equals("email must be unique");
  });
  it("It should fail if email already exist", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/users")
      .send({
        ...userDamie,
        email: "jean@andela.com"
      });
    expect(response.status).equal(400);
    expect(response.body).to.be.an("object");
    expect(response.body.message).eql("username must be unique");
  });

  it("It should return GetAlls", async () => {
    const response = await chai.request(app).get("/api/v1/users");
    console.log("response from test", response);
    expect(response.body.message).to.be.equal("Hello world");
  });
});
