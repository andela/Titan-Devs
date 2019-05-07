import chaiHttp from "chai-http";
import chai, { expect, should } from "chai";
import app from "../../index";
import constants from "../../helpers/constants";
import { user, user2, token } from "../setups.test";

const { OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = constants.statusCode;
chai.use(chaiHttp);
should();
describe("Change Password", () => {
  it("should return user not found", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/jjgjdmr/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "jdkskkfksk343", currentPassword: "lucjdldf2018" });
    expect(results.status).equal(NOT_FOUND);
    expect(results.body.message).equal("User not found");
  });
  it("should return Invalid Current Password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "jdkskkfksk343", currentPassword: "lucjldf2018" });
    expect(results.status).equal(BAD_REQUEST);
    expect(results.body.message).equal("Invalid Current Password");
  });
  it("should return null not allowed", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: null, currentPassword: null });
    expect(results.status).equal(BAD_REQUEST);
    expect(results.body.message).equal("Null values are not allowed!");
  });

  it("should fail on non alphanumeric password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "jdksk", currentPassword: user.password });
    expect(results.status).equal(BAD_REQUEST);
    expect(results.body.message).equal(
      "The password should be an alphanumeric with at least 8 characters"
    );
  });

  it("should return un-authorized", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user2.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "jdkskkfksk343", currentPassword: "password78t67" });

    expect(results.status).equal(UNAUTHORIZED);
  });
  it("should require both new and current password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(results.status).equal(BAD_REQUEST);
    expect(results.body.message).equal(
      "Current and new password are required fields"
    );
  });
  it("should update password", async () => {
    const results = await chai
      .request(app)
      .put(`/api/v1/users/password/${user.username}/change`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "jdkskkfksk343", currentPassword: "password78t67" });
    expect(results.status).equal(OK);
    expect(results.body.message).equal("Password updated successfully");
  });
});
