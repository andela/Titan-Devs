import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../../index";
import { token, user } from "../setups.test";
import constants from "../../helpers/constants";
import { role } from "../helpers/testData";

const { OK, BAD_REQUEST, CONFLICT, CREATED } = constants.statusCode;
const { invalidRole, validRole, validRoleAdmin } = role;
let roleId;
describe("create()", () => {
  describe("when valid information is given", () => {
    it("should create a role", done => {
      chai
        .request(app)
        .post(`/api/v1/role`)
        .set("Authorization", `Bearer ${token}`)
        .send(validRoleAdmin)
        .end((err, res) => {
          roleId = res.body.role.id;
          expect(res.status).equals(CREATED);
          done();
        });
    });
    it("should reply with conflict message", done => {
      chai
        .request(app)
        .post(`/api/v1/role`)
        .set("Authorization", `Bearer ${token}`)
        .send(validRole)
        .end((err, res) => {
          expect(res.status).equals(CONFLICT);
          expect(res.message).equals("Role already exist");
          done();
        });
    });
  });
  describe("when invalid information is given", () => {
    it("shouldn't create a role", done => {
      chai
        .request(app)
        .post(`/api/v1/role`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidRole)
        .end((err, res) => {
          expect(res.status).equals(BAD_REQUEST);
          expect(res.message).equals("Name is required");
          done();
        });
    });
  });
});
describe("createUserRole()", () => {
  describe("when user and role is provided", () => {
    it("should create a user role", done => {
      chai
        .request(app)
        .post(`/api/v1/role/${roleId}/user/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(CREATED);
          done();
        });
    });
    it("should return a conflict message", () => {
      chai
        .request(app)
        .post(`/api/v1/role/${roleId}/user/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).equals(CONFLICT);
          done();
        });
    });
  });
});
describe("getOneRole()", () => {
  it("should get a role", () => {
    chai
      .request(app)
      .post(`/api/v1/role/${roleId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).equals(OK);
        done();
      });
  });
});
