import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";

const userDamie = {
  email: "luc.bayo@gmail.com",
  password: "password",
  firstName: "User",
  lastName: "1"
};
chai.use(chaiHttp);
should();

describe("API end point for auth/signup ", () => {
  it("it is should register user with corret details", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send({ ...userDamie });

    expect(response.status).eql(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.equals("User created successfully");
  });

  it("it should fail if one of email, firstName, lastName, or password is empty", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send({ email: "", password: "", firstName: "", lastName: "" });
    expect(response.status).eql(400);
    expect(response.body.message).eql("User registration failed");
    expect(response.body.errors).to.deep.equal({
      firstName: "Firstname is required",
      lastName: "Lastname is required",
      email: "Email is required",
      password: "Password is required"
    });
  });

  it("it should fail if user provide invalid email", async () => {
    const response = await chai
      .request(app)
      .post("/ap/v1/auth/signup")
      .send({
        ...userDamie,
        email: "abalkjd.com"
      });
    expect(response.status).to.be.eql(400);
    expect(response.body.message).to.be.equal("Invalid email");
  });

  it("It should fail if email already exist", async () => {
    const response = await chai
      .request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: "luc.bayo@gmail.com",
        password: "12345"
      });
    expect(response.status).equal(400);
    expect(response.body).to.be.an("object");
    expect(response.body.message).eql("User already exist");
  });
});
